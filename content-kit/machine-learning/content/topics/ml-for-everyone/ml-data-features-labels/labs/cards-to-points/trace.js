function trace(input) {
  const points = input.points;
  const names = ['Apple', 'Mango'];
  const init = {
    tables: { cards: { rows: points.length, cols: 3,
      colLabels: ['Size (cm)', 'Sweetness', 'Label'],
      rowLabels: points.map((_, i) => 'p' + (i + 1)),
      cells: points.map(p => [p.x, p.y, names[p.cls]]) } },
    plot: { xRange: [0, 10], yRange: [0, 10], xLabel: 'Size (cm)',
      yLabel: 'Sweetness (0–10)', classes: [{ id: 0, label: 'Apple / আপেল' },
        { id: 1, label: 'Mango / আম' }], points: [] }
  };
  const steps = [];
  let apples = 0, mangoes = 0;
  points.forEach((p, i) => {
    const id = 'p' + (i + 1);
    steps.push({ op: 'table-mark', table: 'cards', targets: [[i, 0], [i, 1]],
      tone: 'current', line: 2, vars: { card: id, size: p.x, sweetness: p.y },
      note: { en: `${id}: keep size ${p.x} and sweetness ${p.y} together; they describe one fruit.`,
        bn: `${id}: আকার ${p.x} আর মিষ্টতা ${p.y} একই ফলের মাপ।` } });
    steps.push({ op: 'shape', id: 'read-size', type: 'segment',
      from: [p.x, 0], to: [p.x, p.y], dash: true, tone: 'considered', line: 3,
      note: { en: `Start at size ${p.x} on the horizontal axis, then move up to sweetness ${p.y}.`,
        bn: `আকারের অক্ষে ${p.x} থেকে মিষ্টতা ${p.y} পর্যন্ত ওপরে যাই।` } });
    if (p.cls === 0) apples++; else mangoes++;
    steps.push({ op: 'point-add', id, x: p.x, y: p.y, cls: p.cls, label: id, line: 4,
      vars: { cards: i + 1, apples, mangoes },
      note: { en: `${id} becomes a ${names[p.cls]} dot; colour carries the label, not another coordinate.`,
        bn: `${id}-এর বিন্দুর রং নাম বোঝায়, বাড়তি মাপ নয়।` } });
  });
  steps.push({ op: 'shape-remove', id: 'read-size',
    note: { en: 'All rows are plotted; the guide can go while the fruit dots remain.',
      bn: 'সব সারির বিন্দু আছে। অবস্থানের সহায়ক রেখা সরিয়ে রাখি।' } });
  steps.push({ op: 'done', line: 5, vars: { cards: points.length, apples, mangoes },
    note: { en: `${points.length} cards are preserved, even when dots overlap; a missing label cannot be guessed from colour alone.`,
      bn: `মোট ${points.length}টি কার্ড। বিন্দু মিলে গেলেও দুটি কার্ড আলাদা থাকে।` } });
  return { init, steps };
}
