import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

export const KIT_ROOT = fileURLToPath(new URL('../', import.meta.url));
const SKILLS = ['lynx-delivery', 'lynx-research', 'lynx-data-insight', 'lynx-proposal-ppt', 'lynx-professional-output'];
const TOOLS = ['workbuddy', 'codex', 'cursor', 'all'];
const HELP = `灵熙智能 WorkBuddy 工作 Kit · 0.2.0
员工先读 START-HERE.md，上传技能 ZIP，把办公任务交给 WorkBuddy。

命令（由 AI 或维护者执行）：
  catalog                     查看六类办公任务
  init --directory PATH --type TYPE --name NAME --goal TEXT [--tool workbuddy]
                              创建全新的任务工作区
  attach --directory PATH --type TYPE --name NAME --goal TEXT [--tool workbuddy]
                              给现有项目添加 Kit，保留已有规则
  doctor [--type TYPE]         只读检查工具是否可调用
  check --directory PATH      检查成果文件与证据记录，不替代实际验收
  validate                    检查 Kit 本身的结构与本地链接

init/attach 可加 --dry-run 预览文件清单；--json 输出机器可读结果。
类型从 catalog 获取；需要 Node.js 22+，无需安装本 Kit 的依赖。`;

export async function readCatalog(root = KIT_ROOT) {
  return JSON.parse(await fs.readFile(path.join(root, 'catalog.json'), 'utf8'));
}
async function statMaybe(file) {
  try { return await fs.lstat(file); } catch (e) { if (e.code === 'ENOENT') return null; throw e; }
}
function inside(root, file) {
  const relative = path.relative(root, file);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}
function validRelative(file) {
  return typeof file === 'string' && file.length > 0 && !/[\\\0\r\n]/.test(file)
    && !path.posix.isAbsolute(file) && !/^[A-Za-z]:/.test(file)
    && file.split('/').every(part => part !== '..' && part !== '.' && part !== '');
}
async function assertSafePath(root, relative) {
  if (!validRelative(relative)) throw new Error(`非法相对路径：${String(relative)}`);
  let current = root;
  for (const part of relative.split('/')) {
    current = path.join(current, part);
    const stat = await statMaybe(current);
    if (stat?.isSymbolicLink()) throw new Error(`路径包含符号链接，需先人工核对：${relative}`);
    if (current !== path.join(root, relative) && stat && !stat.isDirectory()) throw new Error(`父路径不是文件夹：${relative}`);
  }
  return current;
}
async function walk(root, prefix = '') {
  const result = [];
  for (const entry of await fs.readdir(path.join(root, prefix), { withFileTypes: true })) {
    if (['node_modules', '.git', '__pycache__', '.lynx-kit', 'work', 'dist'].includes(entry.name)) continue;
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Kit 内容不允许符号链接：${relative}`);
    if (entry.isDirectory()) result.push(...await walk(root, relative));
    else if (entry.isFile()) result.push(relative);
  }
  return result.sort();
}
async function copyPlan(source, destination, root, plan) {
  for (const file of await walk(path.join(root, source))) {
    plan.set(`${destination}/${file}`, await fs.readFile(path.join(root, source, file)));
  }
}
function render(text, values) {
  for (const [key, value] of Object.entries(values)) text = text.split(`{{${key}}}`).join(value);
  return text;
}

export async function buildPlan(options, root = KIT_ROOT) {
  const catalog = await readCatalog(root);
  const profile = catalog.profiles.find(p => p.id === options.type);
  if (!profile) throw new Error('请选择 catalog 中的任务类型。');
  if (!options.name?.trim() || options.name.length > 120 || /[\0\r\n]/.test(options.name)) throw new Error('任务名称需要 1～120 个字符，不能包含换行。');
  if (!options.goal?.trim() || options.goal.length > 12000 || /\0/.test(options.goal)) throw new Error('请用 --goal 填写要完成的目标（最多 12000 个字符）。');
  if (!options.directory) throw new Error('请用 --directory 明确目标项目目录。');
  const tool = options.tool || 'workbuddy';
  if (!TOOLS.includes(tool)) throw new Error('工具请选择 workbuddy、codex、cursor 或 all。');
  let target = path.resolve(options.directory);
  const source = await fs.realpath(root);
  // 不将安装输出写回 Kit 源码或其子目录，也不把源码目录作为被安装项目的子目录。
  if (inside(source, target) || inside(target, source)) throw new Error('目标项目与 Kit 源码目录必须互相独立。');
  const targetStat = await statMaybe(target);
  if (targetStat?.isSymbolicLink()) throw new Error('目标目录是符号链接，请使用已核对的真实项目目录。');
  if (targetStat && !targetStat.isDirectory()) throw new Error('目标路径不是文件夹。');
  if (options.mode === 'attach' && !targetStat) throw new Error('attach 需要一个已存在的项目目录。');
  if (options.mode === 'init' && targetStat && (await fs.readdir(target)).length) throw new Error('init 只接受空目录；现有项目请用 attach。');
  const parent = path.dirname(target);
  const parentStat = await statMaybe(parent);
  if (!parentStat?.isDirectory() || parentStat.isSymbolicLink()) throw new Error('请先选择已存在的真实父目录。');
  target = path.join(await fs.realpath(parent), path.basename(target));
  if (inside(source, target) || inside(target, source)) throw new Error('目标项目与 Kit 源码目录必须互相独立。');
  if (await statMaybe(path.join(target, '.lynx-kit'))) throw new Error('该项目已有 .lynx-kit；为避免覆盖记录，本次未执行。更新方法见 docs/maintenance.md。');

  const plan = new Map();
  for (const dir of ['bin', 'lib', 'skills', 'templates', 'docs']) await copyPlan(dir, `.lynx-kit/${dir}`, root, plan);
  for (const file of ['catalog.json', 'resources.json', 'README.md', 'START-HERE.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md']) plan.set(`.lynx-kit/${file}`, await fs.readFile(path.join(root, file)));
  const values = { name: options.name, goal: options.goal, profileTitle: profile.title };
  for (const file of ['guidance.md', 'brief.md', 'acceptance.md', 'handoff.md']) {
    plan.set(`.lynx-kit/${file}`, render(await fs.readFile(path.join(root, 'templates', file), 'utf8'), values));
  }
  plan.set('.lynx-kit/evidence.json', JSON.stringify({ schemaVersion: 1, task: options.name, status: 'in-progress', environment: 'local', outputs: [], checks: [], limitations: [] }, null, 2) + '\n');
  plan.set('.lynx-kit/config.json', JSON.stringify({ schemaVersion: 1, kitVersion: catalog.version, profile: profile.id, tool, name: options.name }, null, 2) + '\n');
  const guidance = '# Lynx Kit 项目入口\n\n阅读 `.lynx-kit/guidance.md` 并按当前任务加载相关技能。原有项目约定和当前用户指令优先；开始前核对现状，完成后提供实际成果与验证证据。\n';
  const preserved = [];
  for (const [enabled, file, content] of [
    [tool === 'all' || tool === 'codex', 'AGENTS.md', guidance],
    [tool === 'all' || tool === 'workbuddy', 'WORKBUDDY-START.md', `${guidance}\n此文件是供用户复制的任务入口，不保证 WorkBuddy 自动加载。员工使用方式见 .lynx-kit/START-HERE.md。\n`],
    [tool === 'all' || tool === 'cursor', '.cursor/rules/lynx-kit.mdc', `---\ndescription: 公司任务与交付规则\nalwaysApply: true\n---\n\n${guidance}`]
  ]) {
    if (!enabled) continue;
    if (await statMaybe(path.join(target, file))) {
      if (file === 'AGENTS.md' || file === 'WORKBUDDY-START.md') { preserved.push(file); continue; }
      throw new Error(`已有同名工具规则：${file}，本次未执行。`);
    }
    plan.set(file, content);
  }
  for (const [enabled, prefix] of [
    [tool === 'all' || tool === 'codex', '.agents/skills']
  ]) {
    if (enabled) for (const skill of SKILLS) {
      if (await statMaybe(path.join(target, prefix, skill))) throw new Error(`已有同名技能：${prefix}/${skill}，本次未执行。`);
      await copyPlan(`skills/${skill}`, `${prefix}/${skill}`, root, plan);
      // WorkBuddy requires bilingual top-level metadata; Codex uses metadata.
      const entry = `${prefix}/${skill}/SKILL.md`;
      const content = plan.get(entry).toString('utf8');
      plan.set(entry, content.replace(/^---\r?\n([\s\S]*?)\r?\n---/, (_match, front) => {
        const fields = front.split(/\r?\n/);
        const core = fields.filter(line => /^(name|description):/.test(line));
        const metadata = fields.filter(line => !/^(name|description):/.test(line)).map(line => `  ${line}`);
        return `---\n${core.join('\n')}\nmetadata:\n${metadata.join('\n')}\n---`;
      }));
    }
  }
  const starter = `# 继续本次任务\n\n把以下文字复制给项目中的 AI：\n\n> 请先读取 .lynx-kit/guidance.md、.lynx-kit/brief.md 和 .lynx-kit/config.json，按对应任务包继续完成任务。先核对当前项目，遵循已有约定。只询问影响范围、事实、授权或验收的关键缺口，其余持续推进。最后给我可使用的成果、验证证据和未覆盖范围。\n\n任务目标已记录在 brief.md。${preserved.length ? `原有 ${preserved.join('、')} 已保留，请在 AI 会话中明确要求读取 Kit 入口；自动发现不等于保证加载。` : '请在 AI 工具中打开此项目目录。'}\n`;
  plan.set('.lynx-kit/START.md', starter);
  for (const file of plan.keys()) {
    const destination = await assertSafePath(target, file);
    if (await statMaybe(destination)) throw new Error(`目标已存在：${file}，本次未执行。`);
  }
  return { target, plan, profile, preserved };
}

export async function applyPlan({ target, plan }) {
  const createdFiles = [];
  const createdDirs = [];
  async function ensureDir(dir) {
    const stat = await statMaybe(dir);
    if (stat) {
      if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error('安装期间目录发生变化，已停止。');
      return;
    }
    await ensureDir(path.dirname(dir));
    await fs.mkdir(dir);
    createdDirs.push(dir);
  }
  try {
    await ensureDir(target);
    for (const [relative, content] of plan) {
      const destination = await assertSafePath(target, relative);
      await ensureDir(path.dirname(destination));
      await fs.writeFile(destination, content, { flag: 'wx' });
      createdFiles.push(destination);
    }
  } catch (error) {
    for (const file of createdFiles.reverse()) await fs.unlink(file).catch(() => {});
    for (const dir of createdDirs.reverse()) await fs.rmdir(dir).catch(() => {});
    throw error;
  }
}

export async function checkProject(directory) {
  if (!directory) throw new Error('请用 --directory 指定目标项目。');
  const target = path.resolve(directory);
  const stat = await statMaybe(target);
  if (!stat?.isDirectory() || stat.isSymbolicLink()) throw new Error('请选择真实项目目录。');
  const evidencePath = await assertSafePath(target, '.lynx-kit/evidence.json');
  const evidence = JSON.parse(await fs.readFile(evidencePath, 'utf8'));
  const problems = [];
  if (evidence.schemaVersion !== 1) problems.push('证据记录版本必须为 1。');
  if (typeof evidence.task !== 'string' || !evidence.task.trim()) problems.push('缺少任务名称。');
  if (evidence.status !== 'ready-local') problems.push('任务尚未标记 ready-local。');
  if (evidence.environment !== 'local') problems.push('此命令仅检查本地交付；线上和客户验收需单独记录。');
  if (!Array.isArray(evidence.outputs) || !evidence.outputs.length) problems.push('至少提供一个实际成果文件。');
  else for (const output of evidence.outputs) {
    try {
      if (!validRelative(output) || output.startsWith('.lynx-kit/')) throw new Error('请使用项目内实际成果的相对路径，不能把 Kit 记录作为成果。');
      const file = await assertSafePath(target, output);
      const outputStat = await statMaybe(file);
      if (!outputStat?.isFile() || outputStat.size === 0) throw new Error('成果文件不存在、为空或不是普通文件。');
    } catch (error) { problems.push(`成果 ${String(output)}：${error.message}`); }
  }
  if (!Array.isArray(evidence.checks) || !evidence.checks.length) problems.push('至少记录一项实际验证。');
  else for (const check of evidence.checks) {
    if (!check || typeof check.name !== 'string' || !check.name.trim() || check.status !== 'passed'
      || typeof check.evidence !== 'string' || !check.evidence.trim()) problems.push('每项验证必须有名称、passed 状态和实际证据摘要。');
  }
  if (!Array.isArray(evidence.limitations) || evidence.limitations.some(x => typeof x !== 'string' || !x.trim())) problems.push('limitations 应为字符串数组；未覆盖范围需明确记录。');
  return { passed: problems.length === 0, problems, note: '仅核对记录结构和成果文件存在；未执行项目测试，不代表业务、生产或客户验收。' };
}

export async function validateKit(root = KIT_ROOT) {
  const problems = [];
  const catalog = await readCatalog(root);
  if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.profiles) || !catalog.profiles.length) throw new Error('catalog 格式不正确。');
  const ids = new Set();
  for (const profile of catalog.profiles) {
    if (!/^[a-z][a-z0-9-]*$/.test(profile.id) || ids.has(profile.id)) problems.push(`类型 ID 非法或重复：${profile.id}`);
    ids.add(profile.id);
    if (!profile.title || !Array.isArray(profile.tools) || !Array.isArray(profile.outputs) || !profile.outputs.length) problems.push(`类型字段不完整：${profile.id}`);
    const recipe = await assertSafePath(root, profile.recipe);
    if (!(await statMaybe(recipe))?.isFile()) problems.push(`缺少任务包：${profile.recipe}`);
  }
  for (const skill of SKILLS) {
    const text = await fs.readFile(path.join(root, 'skills', skill, 'SKILL.md'), 'utf8');
    const front = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const fields = front && Object.fromEntries(front[1].split(/\r?\n/).map(line => {
      const match = line.match(/^([a-z_]+):\s*(.*)$/);
      if (!match) return ['', ''];
      let value = match[2];
      if (value.startsWith('"')) { try { value = JSON.parse(value); } catch { value = ''; } }
      return [match[1], value];
    }));
    if (!fields || fields.name !== skill || ['description', 'description_zh', 'description_en', 'version', 'author'].some(key => typeof fields[key] !== 'string' || !fields[key].trim()) || fields.version !== catalog.version) problems.push(`WorkBuddy 技能元数据不完整：${skill}`);
  }
  const resources = JSON.parse(await fs.readFile(path.join(root, 'resources.json'), 'utf8'));
  if (resources.schemaVersion !== 1 || !Array.isArray(resources.resources) || !resources.resources.length) problems.push('GitHub 资源目录为空。');
  else for (const resource of resources.resources) {
    if (!/^[\da-f]{40}$/.test(resource.revision) || !resource.license || !resource.integration || !resource.employeeEntry || !resource.dependencies || !resource.dataHandling || !resource.limitations || !/^https:\/\/github\.com\//.test(resource.url)) problems.push(`资源证据不完整：${resource.repository}`);
    if (resource.selected && resource.archived) problems.push(`推荐资源已归档：${resource.repository}`);
  }
  // 只检查打包内容；不遍历用户运行态、依赖或 Git 对象。
  const markdownFiles = ['README.md', 'START-HERE.md'];
  for (const dir of ['docs', 'skills', 'templates']) {
    markdownFiles.push(...(await walk(path.join(root, dir))).filter(x => x.endsWith('.md')).map(x => `${dir}/${x}`));
  }
  for (const file of markdownFiles) {
    // 代码块中的示例路径不是文档导航。
    const text = (await fs.readFile(path.join(root, file), 'utf8')).replace(/```[\s\S]*?```/g, '');
    for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const link = match[1].split('#')[0];
      if (!link || /^[a-z]+:/i.test(link) || link.includes('{{')) continue;
      const destination = path.resolve(path.dirname(path.join(root, file)), decodeURIComponent(link));
      if (!inside(root, destination) || !(await statMaybe(destination))) problems.push(`无效本地链接：${file} → ${link}`);
    }
  }
  return { passed: problems.length === 0, profiles: ids.size, skills: SKILLS.length, problems };
}

function parse(args) {
  const command = args[0] || 'help';
  const options = {};
  const valued = new Set(['directory', 'type', 'name', 'goal', 'tool']);
  const switches = new Set(['dry-run', 'json']);
  for (let i = 1; i < args.length; i++) {
    if (!args[i].startsWith('--')) throw new Error(`未知参数：${args[i]}`);
    const key = args[i].slice(2);
    if (Object.hasOwn(options, key)) throw new Error(`重复参数：--${key}`);
    if (switches.has(key)) options[key] = true;
    else if (valued.has(key) && args[i + 1] !== undefined && !args[i + 1].startsWith('--')) options[key] = args[++i];
    else throw new Error(`未知参数或缺少值：--${key}`);
  }
  return { command, options };
}
export async function run(args) {
  if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('请使用 Node.js 22+。');
  const { command, options } = parse(args);
  if (command === 'help' || command === '--help' || command === '-h') { console.log(HELP); return 0; }
  if (command === 'catalog') {
    const catalog = await readCatalog();
    console.log(options.json ? JSON.stringify(catalog, null, 2) : catalog.profiles.map(p => `${p.id.padEnd(20)} ${p.title} · ${p.examples[0]}`).join('\n'));
    return 0;
  }
  if (command === 'init' || command === 'attach') {
    const result = await buildPlan({ ...options, mode: command });
    if (!options['dry-run']) await applyPlan(result);
    const output = { mode: command, dryRun: Boolean(options['dry-run']), directory: result.target, profile: result.profile.id, created: [...result.plan.keys()], preserved: result.preserved };
    console.log(options.json ? JSON.stringify(output, null, 2) : `${options['dry-run'] ? '预览，未写入文件' : 'Kit 已安装'}：${result.target}\n任务类型：${result.profile.title}\n文件数：${result.plan.size}\n${result.preserved.length ? `已保留原有 ${result.preserved.join('、')}。\n` : ''}下一步：打开 .lynx-kit/START.md，把其中的文字交给项目中的 AI。`);
    return 0;
  }
  if (command === 'doctor') {
    const catalog = await readCatalog();
    const profile = options.type && catalog.profiles.find(p => p.id === options.type);
    if (options.type && !profile) throw new Error('未知任务类型。');
    const required = profile?.tools || [];
    const probes = required.map(tool => {
      const probe = spawnSync(tool, [tool === 'java' ? '-version' : '--version'], { shell: false, timeout: 5000, encoding: 'utf8', windowsHide: true });
      return { tool, available: !probe.error && probe.status === 0 };
    });
    const output = { probes, note: '员工默认使用 WorkBuddy UI，无需开发工具。此命令仅探测可选 CLI；WorkBuddy 技能导入、Office/联网工具与账号能力需在实际会话核对。未读取凭据或启动服务。' };
    console.log(options.json ? JSON.stringify(output, null, 2) : `${probes.map(x => `${x.available ? '可调用' : '未就绪'}：${x.tool}`).join('\n')}\n${output.note}`);
    return probes.every(p => p.available) ? 0 : 2;
  }
  if (command === 'check' || command === 'validate') {
    const output = command === 'check' ? await checkProject(options.directory) : await validateKit();
    console.log(options.json ? JSON.stringify(output, null, 2) : `${output.passed ? '记录检查通过' : '记录检查未通过'}${output.profiles ? `：${output.profiles} 类任务、${output.skills} 个技能` : ''}\n${output.problems.join('\n')}\n${output.note || ''}`.trim());
    return output.passed ? 0 : 2;
  }
  throw new Error(`未知命令：${command}。使用 help 查看用法。`);
}
