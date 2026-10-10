import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { KIT_ROOT, readCatalog, buildPlan, applyPlan, checkProject, validateKit } from '../lib/kit.mjs';

async function fixture(t) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'lynx-kit-test-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  return directory;
}
function options(directory, overrides = {}) {
  return { mode: 'init', directory, type: 'proposal-ppt', name: '客户方案', goal: '准备客户内容运营方案', tool: 'all', ...overrides };
}
async function install(directory, overrides) {
  const plan = await buildPlan(options(directory, overrides));
  await applyPlan(plan);
  return plan;
}
async function setEvidence(directory, overrides = {}) {
  const evidence = { schemaVersion: 1, task: '测试交付', status: 'ready-local', environment: 'local', outputs: ['outputs/report.md'], checks: [{ name: '实际文件检查', status: 'passed', evidence: '已读取内容并核对输出' }], limitations: ['仅本地验证'], ...overrides };
  await fs.writeFile(path.join(directory, '.lynx-kit/evidence.json'), JSON.stringify(evidence));
}
async function addOutput(directory) {
  await fs.mkdir(path.join(directory, 'outputs'));
  await fs.writeFile(path.join(directory, 'outputs/report.md'), '# 实际成果\n');
}

test('Kit 任务、技能与本地导航完整', async () => {
  assert.deepEqual(await validateKit(), { passed: true, profiles: 9, skills: 8, problems: [] });
});

test('九类办公任务生成正确类型且不伪造完成状态', async t => {
  const temporary = await fixture(t);
  for (const profile of (await readCatalog()).profiles) {
    const target = path.join(temporary, profile.id);
    await install(target, { type: profile.id, tool: 'codex' });
    const config = JSON.parse(await fs.readFile(path.join(target, '.lynx-kit/config.json')));
    assert.equal(config.profile, profile.id);
    assert.equal((await checkProject(target)).passed, false);
    for (const skill of ['lynx-delivery', profile.skill]) {
      assert.equal((await fs.stat(path.join(target, `.agents/skills/${skill}/SKILL.md`))).isFile(), true);
    }
  }
});

test('完整安装可通过安装包自己的 validate，WorkBuddy 与两个维护入口存在', async t => {
  const target = path.join(await fixture(t), 'new');
  await install(target);
  for (const relative of ['AGENTS.md', 'WORKBUDDY-START.md', '.cursor/rules/lynx-kit.mdc', '.agents/skills/lynx-professional-output/SKILL.md']) assert.equal((await fs.stat(path.join(target, relative))).isFile(), true);
  assert.equal((await validateKit(path.join(target, '.lynx-kit'))).passed, true);
});

test('旧项目接入保留原有规则和业务文件', async t => {
  const target = await fixture(t);
  for (const file of ['AGENTS.md', 'WORKBUDDY-START.md', 'business.txt']) await fs.writeFile(path.join(target, file), `用户内容：${file}\n`);
  const plan = await install(target, { mode: 'attach' });
  assert.deepEqual(plan.preserved, ['AGENTS.md', 'WORKBUDDY-START.md']);
  for (const file of ['AGENTS.md', 'WORKBUDDY-START.md', 'business.txt']) assert.equal(await fs.readFile(path.join(target, file), 'utf8'), `用户内容：${file}\n`);
});

test('dry-run CLI 不创建目标目录', async t => {
  const target = path.join(await fixture(t), 'preview');
  const result = spawnSync(process.execPath, [path.join(KIT_ROOT, 'bin/lynx-kit.mjs'), 'init', '--directory', target, '--type', 'client-research', '--name', '预览', '--goal', '准备客户研究', '--dry-run', '--json'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).dryRun, true);
  await assert.rejects(fs.stat(target), { code: 'ENOENT' });
});

test('init 拒绝已有项目，attach 拒绝不存在目录', async t => {
  const target = await fixture(t);
  await fs.writeFile(path.join(target, 'existing.txt'), '保留');
  await assert.rejects(buildPlan(options(target)), /空目录/);
  await assert.rejects(buildPlan(options(path.join(target, 'absent'), { mode: 'attach' })), /已存在/);
  assert.equal(await fs.readFile(path.join(target, 'existing.txt'), 'utf8'), '保留');
});

test('重复安装与同名技能冲突在写入前拒绝', async t => {
  const temporary = await fixture(t);
  const first = path.join(temporary, 'first');
  await install(first);
  await assert.rejects(buildPlan(options(first, { mode: 'attach' })), /已有 .lynx-kit/);
  const second = path.join(temporary, 'second');
  await fs.mkdir(path.join(second, '.agents/skills/lynx-delivery'), { recursive: true });
  await fs.writeFile(path.join(second, '.agents/skills/lynx-delivery/SKILL.md'), '原技能');
  await assert.rejects(buildPlan(options(second, { mode: 'attach' })), /同名技能/);
  await assert.rejects(fs.stat(path.join(second, '.lynx-kit')), { code: 'ENOENT' });
});

test('Cursor 同名规则冲突不会发生部分安装', async t => {
  const target = await fixture(t);
  await fs.mkdir(path.join(target, '.cursor/rules'), { recursive: true });
  await fs.writeFile(path.join(target, '.cursor/rules/lynx-kit.mdc'), '已有规则');
  await assert.rejects(buildPlan(options(target, { mode: 'attach' })), /同名工具规则/);
  await assert.rejects(fs.stat(path.join(target, '.lynx-kit')), { code: 'ENOENT' });
});

test('Unicode、引号与 shell 特殊字符保持文本，不被执行', async t => {
  const temporary = await fixture(t);
  const target = path.join(temporary, '中文 空格');
  const name = '客户 "A" $() `特殊`';
  const goal = '保留 C:\\资料\\新项目\n第二行：$HOME 和 `echo`';
  await install(target, { name, goal });
  const evidence = JSON.parse(await fs.readFile(path.join(target, '.lynx-kit/evidence.json')));
  assert.equal(evidence.task, name);
  assert.ok((await fs.readFile(path.join(target, '.lynx-kit/brief.md'), 'utf8')).includes(goal));
});

test('只装所选工具；错误类型、工具、名称与参数拒绝', async t => {
  const target = path.join(await fixture(t), 'selected');
  await install(target, { tool: 'cursor' });
  await assert.rejects(fs.stat(path.join(target, '.agents')), { code: 'ENOENT' });
  await assert.rejects(fs.stat(path.join(target, 'WORKBUDDY-START.md')), { code: 'ENOENT' });
  const unused = path.join(path.dirname(target), 'unused');
  for (const override of [{ type: 'unknown' }, { tool: 'unknown' }, { name: '换行\n不合法' }, { goal: '' }]) await assert.rejects(buildPlan(options(unused, override)));
  const result = spawnSync(process.execPath, [path.join(KIT_ROOT, 'bin/lynx-kit.mjs'), 'init', '--unknown'], { encoding: 'utf8' });
  assert.equal(result.status, 1);
});

test('写入期间冲突会撤销本次文件，保留冲突文件', async t => {
  const target = await fixture(t);
  const plan = new Map([['new/first.txt', '本次新增'], ['conflict.txt', '不可覆盖']]);
  await fs.writeFile(path.join(target, 'conflict.txt'), '原有');
  await assert.rejects(applyPlan({ target, plan }), { code: 'EEXIST' });
  await assert.rejects(fs.stat(path.join(target, 'new')), { code: 'ENOENT' });
  assert.equal(await fs.readFile(path.join(target, 'conflict.txt'), 'utf8'), '原有');
});

test('路径越界不能安装，Kit 源码不能成为安装目标', async t => {
  const target = await fixture(t);
  await assert.rejects(applyPlan({ target, plan: new Map([['../escaped.txt', '不能写']]) }), /非法相对路径/);
  await assert.rejects(buildPlan(options(KIT_ROOT, { mode: 'attach' })), /互相独立/);
  await assert.rejects(fs.stat(path.join(path.dirname(target), 'escaped.txt')), { code: 'ENOENT' });
});

test('证据未完成、失败、缺摘要、缺文件和伪成果均不能通过', async t => {
  const target = path.join(await fixture(t), 'evidence');
  await install(target);
  await addOutput(target);
  const variants = [
    { status: 'in-progress' }, { environment: 'production' }, { schemaVersion: 2 },
    { outputs: [] }, { outputs: ['absent.md'] }, { outputs: ['.lynx-kit/brief.md'] },
    { checks: [] }, { checks: [{ name: '失败', status: 'failed', evidence: '失败' }] },
    { checks: [{ name: '验证', status: 'passed', evidence: '' }] }, { limitations: '未测' }
  ];
  for (const override of variants) {
    await setEvidence(target, override);
    assert.equal((await checkProject(target)).passed, false, JSON.stringify(override));
  }
});

test('证据拒绝越界与空文件，接受真实本地文件与完整记录', async t => {
  const target = path.join(await fixture(t), 'valid');
  await install(target);
  await addOutput(target);
  await fs.writeFile(path.join(target, 'empty.txt'), '');
  for (const output of ['../private.txt', '/absolute.txt', 'C:/private.txt', 'outputs\\report.md', 'empty.txt']) {
    await setEvidence(target, { outputs: [output] });
    assert.equal((await checkProject(target)).passed, false);
  }
  await setEvidence(target);
  assert.equal((await checkProject(target)).passed, true);
  const result = spawnSync(process.execPath, [path.join(target, '.lynx-kit/bin/lynx-kit.mjs'), 'check', '--directory', target, '--json'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).passed, true);
});

test('安装与证据路径拒绝符号链接', { skip: process.platform === 'win32' ? 'Windows 无特权账户无法创建符号链接；Linux/macOS 覆盖' : false }, async t => {
  const temporary = await fixture(t);
  const outside = path.join(temporary, 'outside');
  const project = path.join(temporary, 'project');
  await fs.mkdir(outside);
  await fs.mkdir(project);
  await fs.symlink(outside, path.join(project, '.cursor'), 'dir');
  await assert.rejects(buildPlan(options(project, { mode: 'attach', tool: 'cursor' })), /符号链接/);
  assert.deepEqual(await fs.readdir(outside), []);
  await fs.unlink(path.join(project, '.cursor'));
  await install(project, { mode: 'attach' });
  await fs.writeFile(path.join(outside, 'private.md'), '私有');
  await fs.symlink(path.join(outside, 'private.md'), path.join(project, 'linked.md'));
  await setEvidence(project, { outputs: ['linked.md'] });
  assert.equal((await checkProject(project)).passed, false);
});


test('默认 WorkBuddy 不创建开发工具规则，不猜测自动加载目录', async t => {
  const target = path.join(await fixture(t), 'office');
  await install(target, { tool: undefined });
  assert.equal((await fs.stat(path.join(target, 'WORKBUDDY-START.md'))).isFile(), true);
  for (const relative of ['AGENTS.md', '.agents', '.cursor', '.workbuddy']) await assert.rejects(fs.stat(path.join(target, relative)), { code: 'ENOENT' });
  const config = JSON.parse(await fs.readFile(path.join(target, '.lynx-kit/config.json')));
  assert.equal(config.tool, 'workbuddy');
  assert.equal((await fs.stat(path.join(target, '.lynx-kit/resources.json'))).isFile(), true);
  await assert.rejects(fs.stat(path.join(target, '.lynx-kit/skills/lynx-proposal-ppt/scripts/node_modules')), { code: 'ENOENT' });
});
