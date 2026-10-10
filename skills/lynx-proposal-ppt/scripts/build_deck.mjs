import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function text(value, label, limit) {
  if (typeof value !== 'string' || !value.trim() || value.length > limit || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value)) throw new Error(`${label}需为 1～${limit} 字符，请减少文字或拆页。`);
}
export function validateDeck(deck) {
  if (!deck || typeof deck !== 'object') throw new Error('输入必须为演示 JSON。');
  text(deck.title, '主题', 120);
  if (deck.fontFace !== undefined) text(deck.fontFace, '字体', 60);
  if (!Array.isArray(deck.slides) || !deck.slides.length || deck.slides.length > 40) throw new Error('页数需为 1～40。');
  for (const slide of deck.slides) {
    if (!slide || typeof slide !== 'object') throw new Error('页面格式无效。');
    text(slide.title, '页面标题', 40);
    text(slide.notes, '讲稿/来源说明', 10000);
    if (slide.kind === 'bullets') {
      if (!Array.isArray(slide.bullets) || !slide.bullets.length || slide.bullets.length > 5) throw new Error('正文需为 1～5 条。');
      for (const bullet of slide.bullets) text(bullet, '正文项', 90);
    } else if (slide.kind === 'table') {
      const table = slide.table;
      if (!table || !Array.isArray(table.headers) || !table.headers.length || table.headers.length > 4 || !Array.isArray(table.rows) || !table.rows.length || table.rows.length > 8) throw new Error('表格需为 1～4 列、1～8 行。');
      for (const cell of table.headers) text(cell, '表头', 20);
      for (const row of table.rows) {
        if (!Array.isArray(row) || row.length !== table.headers.length) throw new Error('表格列数不匹配。');
        for (const cell of row) text(cell, '表格单元格', 32);
      }
    } else if (slide.kind === 'chart') {
      const chart = slide.chart;
      if (!chart || !['bar', 'line', 'pie'].includes(chart.type) || !Array.isArray(chart.series) || !chart.series.length || chart.series.length > 4) throw new Error('图表需为 bar/line/pie，1～4 个系列。');
      text(chart.unit, '图表单位', 35);
      const labels = chart.series[0].labels;
      if (!Array.isArray(labels) || !labels.length || labels.length > 8) throw new Error('图表需为 1～8 个标签。');
      for (const label of labels) text(label, '标签', 20);
      for (const series of chart.series) {
        text(series.name, '系列名', 30);
        if (JSON.stringify(series.labels) !== JSON.stringify(labels) || !Array.isArray(series.values) || series.values.length !== labels.length || series.values.some(x => typeof x !== 'number' || !Number.isFinite(x))) throw new Error('图表标签需一致，数值需有限且数量匹配。');
      }
      if (chart.type === 'pie' && (chart.series.length !== 1 || chart.series[0].values.some(x => x < 0) || chart.series[0].values.every(x => x === 0))) throw new Error('饼图需单系列、非负且总量大于零。');
    } else if (slide.kind === 'closing') {
      text(slide.subtitle, '结束页副标题', 80);
    } else throw new Error('不支持的页面类型。');
  }
}

export async function buildDeck(input, output) {
  validateDeck(input);
  // The underlying presentation library normalizes chart labels in place.
  input = structuredClone(input);
  if (path.extname(output).toLowerCase() !== '.pptx') throw new Error('输出文件需为 .pptx。');
  try { await fs.lstat(output); throw new Error('输出已存在，拒绝覆盖。'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  let PptxGenJS;
  try { ({ default: PptxGenJS } = await import('pptxgenjs')); }
  catch (error) { throw new Error('缺少固定 PPT 依赖。请由 AI/维护者在此脚本目录 npm ci --ignore-scripts。', { cause: error }); }
  const pptx = new PptxGenJS();
  const fontFace = input.fontFace || 'Microsoft YaHei';
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = input.author || '灵熙智能';
  pptx.subject = input.title;
  pptx.title = input.title;
  pptx.lang = 'zh-CN';
  pptx.theme = { headFontFace: fontFace, bodyFontFace: fontFace, lang: 'zh-CN' };
  input.slides.forEach((page, index) => {
    const slide = pptx.addSlide();
    slide.background = { color: 'F7F9FC' };
    slide.addShape(pptx.ShapeType.rect, { x: 0.7, y: 0.65, w: 0.08, h: 0.52, fill: { color: '008D88' }, line: { color: '008D88' } });
    slide.addText(page.title, { x: 0.95, y: 0.58, w: 11.5, h: 0.85, fontFace, fontSize: 27, bold: true, color: '172B4D', margin: 0, breakLine: false, valign: 'mid' });
    if (page.kind === 'bullets') {
      slide.addText(page.bullets.map(x => `• ${x}`).join('\n\n'), { x: 1, y: 1.9, w: 11.2, h: 4.6, fontFace, fontSize: 21, color: '253858', margin: 0, valign: 'top', paraSpaceAfterPt: 8 });
    } else if (page.kind === 'table') {
      const rows = [page.table.headers.map(value => ({ text: value, options: { bold: true, color: 'FFFFFF', fill: '172B4D' } })), ...page.table.rows];
      slide.addTable(rows, { x: 0.95, y: 1.85, w: 11.5, h: 4.6, fontFace, fontSize: 16, color: '253858', border: { type: 'solid', pt: 0.5, color: 'D6DEE8' }, margin: 0.1, autoPage: false, valign: 'mid' });
    } else if (page.kind === 'chart') {
      slide.addChart(pptx.ChartType[page.chart.type], page.chart.series, { x: 1, y: 1.8, w: 11.3, h: 4.7, showTitle: true, title: page.chart.unit, titleFontFace: fontFace, titleFontSize: 14, showLegend: true, showValue: true, catAxisLabelFontFace: fontFace, valAxisLabelFontFace: fontFace, legendFontFace: fontFace, chartColors: ['008D88', '335C81', '8C6BBD', 'B87738'], showCatName: page.chart.type === 'pie', showPercent: page.chart.type === 'pie', showBorder: false });
    } else {
      slide.addText(page.subtitle, { x: 1, y: 2.5, w: 11.2, h: 2, fontFace, fontSize: 26, color: '335C81', margin: 0, valign: 'mid' });
    }
    slide.addText(`灵熙智能   |   ${index + 1} / ${input.slides.length}`, { x: 1, y: 6.95, w: 11.2, h: 0.25, fontFace, fontSize: 10, color: '627086', margin: 0 });
    slide.addNotes(page.notes);
  });
  const buffer = await pptx.write({ outputType: 'nodebuffer' });
  // Reserve only after construction. wx also protects against a concurrent writer.
  const handle = await fs.open(output, 'wx');
  try { await handle.writeFile(buffer); }
  catch (error) { await handle.close(); await fs.unlink(output).catch(() => {}); throw error; }
  await handle.close();
  return { slides: input.slides.length, file: output, note: '已生成原生可编辑 PPT；仍需逐页视觉检查。' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    if (process.argv.length !== 5 || process.argv[3] !== '--output') throw new Error('用法：node build_deck.mjs INPUT.json --output OUTPUT.pptx');
    const input = JSON.parse(await fs.readFile(process.argv[2], 'utf8'));
    console.log(JSON.stringify(await buildDeck(input, path.resolve(process.argv[4])), null, 2));
  } catch (error) { console.error(`PPT 未完成：${error.message}`); process.exitCode = 1; }
}
