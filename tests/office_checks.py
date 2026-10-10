import importlib.util
import json
import posixpath
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from zipfile import ZipFile
import re

ROOT = Path(__file__).resolve().parents[1]


def load(name, relative):
    spec = importlib.util.spec_from_file_location(name, ROOT / relative)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


quality = load('quality', 'skills/lynx-data-insight/scripts/data_quality.py')
packager = load('packager', 'scripts/build_packages.py')


class OfficeChecks(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.directory = Path(self.temp.name)

    def csv(self, text, encoding='utf-8-sig'):
        source = self.directory / 'source.csv'
        source.write_text(text, encoding=encoding)
        return source

    def test_decimal_missing_invalid_duplicates_and_privacy(self):
        source = self.csv('客户,amount\n保密名称,0.10\n另一个,0.20\n缺值,\n非法,NaN\n另一个,0.20\n零,0\n')
        original = source.read_bytes()
        report = quality.analyze(source, ['amount'])
        self.assertEqual(report['rows'], 6)
        self.assertEqual(report['duplicateRowsBeyondFirst'], 1)
        self.assertEqual(report['numeric']['amount'], {'valid': 4, 'missing': 1, 'invalid': 1, 'sum': '0.50', 'mean': '0.125', 'min': '0', 'max': '0.20'})
        self.assertNotIn('保密名称', json.dumps(report, ensure_ascii=False))
        self.assertEqual(source.read_bytes(), original)
        self.assertEqual(len(report['sourceSha256']), 64)

    def test_rejects_bad_shape_headers_and_columns(self):
        for contents in ['', 'a,a\n1,2\n', 'a,\n1,2\n', 'a,b\n1\n']:
            with self.assertRaises(ValueError):
                quality.analyze(self.csv(contents), [])
        with self.assertRaises(ValueError):
            quality.analyze(self.csv('a\n1\n'), ['unknown'])

    def test_gb18030_and_no_silent_units(self):
        report = quality.analyze(self.csv('金额\n0\n"1,000"\n3%\nNA\n', 'gb18030'), ['金额'], encoding='gb18030')
        self.assertEqual(report['numeric']['金额']['valid'], 1)
        self.assertEqual(report['numeric']['金额']['invalid'], 3)
        self.assertEqual(report['missingByColumn']['金额'], 0)

    def test_formula_cache_and_sheet_selection(self):
        import openpyxl
        book = openpyxl.Workbook()
        ws = book.active
        ws.title = '运营'
        ws.append(['amount'])
        ws.append([0])
        ws.append(['=1+2'])
        source = self.directory / 'sample.xlsx'
        book.save(source)
        book.close()
        report = quality.analyze(source, ['amount'], sheet='运营')
        self.assertEqual(report['formulaCells'], 1)
        self.assertEqual(report['numeric']['amount']['missing'], 1)
        self.assertEqual(report['numeric']['amount']['sum'], '0')
        self.assertTrue(report['warnings'])
        with self.assertRaises(ValueError):
            quality.analyze(source, ['amount'], sheet='不存在')

    def test_output_and_input_preserved_on_conflict(self):
        source = self.csv('a\n1\n')
        output = self.directory / 'report.json'
        output.write_text('保留', encoding='utf-8')
        result = subprocess.run([sys.executable, str(ROOT / 'skills/lynx-data-insight/scripts/data_quality.py'), str(source), '--numeric', 'a', '--output', str(output)], capture_output=True, text=True)
        self.assertEqual(result.returncode, 2)
        self.assertEqual(output.read_text(encoding='utf-8'), '保留')
        self.assertIn('a', source.read_text(encoding='utf-8-sig'))

    def test_standalone_packages_and_reproducible_hashes(self):
        first = packager.build(self.directory / 'first')
        second = packager.build(self.directory / 'second')
        self.assertEqual(first, second)
        self.assertEqual(len(first), 9)
        for item in first:
            with ZipFile(self.directory / 'first' / item['file']) as archive:
                names = archive.namelist()
                self.assertFalse(any('node_modules' in name or '__pycache__' in name or '..' in name.split('/') for name in names))
                if item['file'].startswith('workbuddy-'):
                    self.assertFalse(any(name.startswith('scripts/') or name.endswith(('.py', '.mjs', '.sh')) for name in names))
                    self.assertIn('SKILL.md', names)
                    self.assertIn('LICENSE.txt', names)
                    body = archive.read('SKILL.md').decode('utf-8')
                    for key in ['name', 'description', 'description_zh', 'description_en', 'author', 'version']:
                        self.assertRegex(body, rf'(?m)^{key}: .+$')
                    for name in names:
                        if not name.endswith('.md'):
                            continue
                        markdown = re.sub(r'```[\s\S]*?```', '', archive.read(name).decode('utf-8'))
                        for link in re.findall(r'\[[^\]]*\]\(([^)]+)\)', markdown):
                            if re.match(r'^[a-z]+:', link):
                                continue
                            local = posixpath.normpath(posixpath.join(posixpath.dirname(name), link.split('#')[0]))
                            self.assertFalse(local == '..' or local.startswith('../'))
                            self.assertIn(local, names, f'{name} -> {link}')
                else:
                    self.assertTrue(any(name.endswith('/skills/lynx-data-insight/scripts/data_quality.py') for name in names))
                    self.assertTrue(any(name.endswith('/skills/lynx-proposal-ppt/scripts/build_deck.mjs') for name in names))
        with self.assertRaises(ValueError):
            packager.build(self.directory / 'first')


if __name__ == '__main__':
    unittest.main(verbosity=2)
