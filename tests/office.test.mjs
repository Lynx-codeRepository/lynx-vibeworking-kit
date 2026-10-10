import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { buildDeck, validateDeck } from '../skills/lynx-proposal-ppt/scripts/build_deck.mjs';
import { KIT_ROOT } from '../lib/kit.mjs';

const python = process.env.LYNX_KIT_PYTHON || (process.platform === 'win32' ? 'python' : 'python3');

test('数据检查与独立 ZIP 的实质回归', () => {
  const result = spawnSync(python, [path.join(KIT_ROOT, 'tests/office_checks.py')], { encoding: 'utf8', timeout: 60000 });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test('真实 PPT 含可编辑文本/表格/图表及讲稿，并拒绝覆盖', async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'lynx-ppt-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const input = JSON.parse(await fs.readFile(path.join(KIT_ROOT, 'skills/lynx-proposal-ppt/templates/deck.json')));
  const output = path.join(directory, '示例.pptx');
  assert.equal((await buildDeck(input, output)).slides, 4);
  const original = await fs.readFile(output);
  await assert.rejects(buildDeck(input, output), /拒绝覆盖/);
  assert.deepEqual(await fs.readFile(output), original);
  const code = `import sys,zipfile,xml.etree.ElementTree as E
with zipfile.ZipFile(sys.argv[1]) as z:
 assert z.testzip() is None
 slides=[n for n in z.namelist() if n.startswith('ppt/slides/slide') and n.endswith('.xml')]
 assert len(slides)==4
 assert len([n for n in z.namelist() if n.startswith('ppt/notesSlides/notesSlide') and n.endswith('.xml')])==4
 assert 'ppt/charts/chart1.xml' in z.namelist()
 assert any(n.startswith('ppt/embeddings/') and n.endswith('.xlsx') for n in z.namelist())
 ns={'a':'http://schemas.openxmlformats.org/drawingml/2006/main'}
 assert E.fromstring(z.read('ppt/slides/slide1.xml')).findall('.//a:t',ns)
 assert E.fromstring(z.read('ppt/slides/slide3.xml')).find('.//a:tbl',ns) is not None
 assert '虚构示例' in z.read('ppt/notesSlides/notesSlide1.xml').decode('utf-8')
 print('native texts, table, chart workbook, notes verified')`;
  const inspected = spawnSync(python, ['-c', code, output], { encoding: 'utf8' });
  assert.equal(inspected.status, 0, inspected.stderr);
});

test('PPT 对超长/缺少来源/非法图表拒绝生成，不静默截断', async t => {
  const sample = JSON.parse(await fs.readFile(path.join(KIT_ROOT, 'skills/lynx-proposal-ppt/templates/deck.json')));
  for (const mutate of [
    d => { d.slides[0].title = '长'.repeat(41); },
    d => { d.slides[0].notes = ''; },
    d => { d.slides[1].chart.series[0].values = [1, NaN]; },
    d => { d.slides[1].chart.type = 'pie'; d.slides[1].chart.series[0].values = [-1, 1]; },
    d => { d.slides[2].table.rows[0] = ['少一列']; },
    d => { d.slides[0].bullets = Array(6).fill('多条'); }
  ]) {
    const input = structuredClone(sample); mutate(input);
    assert.throws(() => validateDeck(input));
  }
});
