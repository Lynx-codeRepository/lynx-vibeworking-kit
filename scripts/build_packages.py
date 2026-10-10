"""Build eight configuration-free WorkBuddy skill ZIPs and a maintainer kit."""
import argparse
import hashlib
import json
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
SKILLS = ['lynx-delivery', 'lynx-research', 'lynx-data-insight', 'lynx-proposal-ppt', 'lynx-professional-output', 'lynx-competitive-brief', 'lynx-content-plan', 'lynx-writing-polish']
EXCLUDED = {'.git', 'node_modules', '__pycache__', 'work', 'dist', '.lynx-kit', '.venv'}


def files_in(directory):
    for child in sorted(directory.iterdir()):
        if child.name in EXCLUDED or child.name.endswith(('.pyc', '.zip', '.log', '.pptx')):
            continue
        if child.is_symlink():
            raise ValueError(f'不打包符号链接：{child.name}')
        if child.is_dir():
            yield from files_in(child)
        elif child.is_file():
            yield child


def write_zip(destination, files, base, prefix=''):
    with ZipFile(destination, 'x', compression=ZIP_DEFLATED) as archive:
        for file in files:
            relative = prefix + file.relative_to(base).as_posix()
            info = ZipInfo(relative, date_time=(2026, 10, 10, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            archive.writestr(info, file.read_bytes())


def build(output, root=ROOT):
    output = Path(output).resolve()
    if output == root or root in output.parents:
        raise ValueError('发布目录须在源码目录之外，避免把发布包混入源码。')
    if output.exists() and any(output.iterdir()):
        raise ValueError('发布目录必须为空，拒绝覆盖。')
    output.mkdir(parents=True, exist_ok=True)
    version = json.loads((root / 'catalog.json').read_text(encoding='utf-8'))['version']
    generated = []
    for skill in SKILLS:
        source = root / 'skills' / skill
        if not (source / 'SKILL.md').is_file():
            raise ValueError(f'缺少技能入口：{skill}')
        target = output / f'workbuddy-{skill}-v{version}.zip'
        # Employee packages use WorkBuddy's existing tools. Keep optional
        # maintenance code and dependency manifests in the maintainer kit.
        employee_files = [file for file in files_in(source) if file.relative_to(source).parts[0] != 'scripts']
        write_zip(target, employee_files, source)
        generated.append(target)
    directories = ['bin', 'lib', 'skills', 'templates', 'docs', 'scripts', 'tests', '.github']
    names = ['README.md', 'START-HERE.md', 'AGENTS.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md', 'catalog.json', 'resources.json', 'package.json', 'package-lock.json', '.gitignore']
    complete = [root / name for name in names]
    for directory in directories:
        complete.extend(files_in(root / directory))
    target = output / f'lynx-workbuddy-office-kit-v{version}.zip'
    write_zip(target, sorted(complete), root, prefix=f'lynx-workbuddy-office-kit-v{version}/')
    generated.append(target)
    manifest = []
    for file in generated:
        with ZipFile(file) as archive:
            if archive.testzip() is not None:
                raise ValueError('ZIP 完整性检查失败。')
            count = len(archive.namelist())
        manifest.append({'file': file.name, 'sha256': hashlib.sha256(file.read_bytes()).hexdigest(), 'bytes': file.stat().st_size, 'files': count})
    (output / 'manifest.json').write_text(json.dumps({'version': version, 'packages': manifest}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (output / 'SHA256SUMS.txt').write_text(''.join(f"{m['sha256']}  {m['file']}\n" for m in manifest), encoding='utf-8')
    return manifest


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(build(args.output), ensure_ascii=False, indent=2))
