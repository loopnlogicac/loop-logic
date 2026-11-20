function trace(input) {
  const vocabulary = ['free', 'ক্লাস'];
  const messages = [['free free', 1], ['free ফ্রি', 1], ['free win', 1],
    ['ক্লাস ক্লাস', 0], ['ক্লাস meet', 0], ['ক্লাস class', 0]];
  const counts = [[0, 0], [0, 0]], documents = [0, 0];
  const round = n => Math.round(n * 1000) / 1000;
  const note = (en, bn) => ({ en, bn });
  const init = { tables: {
    counts: { rows: 2, cols: 2, rowLabels: ['Ham (0)', 'Spam (1)'], colLabels: vocabulary, cells: [[0, 0], [0, 0]] },
    likelihood: { rows: 2, cols: 2, rowLabels: ['Ham (0)', 'Spam (1)'], colLabels: vocabulary },
    priors: { rows: 2, cols: 2, rowLabels: ['Ham (0)', 'Spam (1)'], colLabels: ['Messages', 'Prior'], cells: [[0, null], [0, null]] }
  }, chart: { xLabel: 'Class', yLabel: 'Joint log score', series: [{ id: 'scores', label: 'Joint log score', type: 'bar', points: [] }] } };
  const steps = [];
  for (const [text, label] of messages) {
    ++documents[label];
    steps.push({ op: 'table-set', table: 'priors', r: label, c: 0, value: documents[label], line: 1,
      note: note(`Count one labelled message for class ${label}: ${text}.`, `লেবেল ${label}-এর একটি message গুনো: ${text}।`) });
    for (const word of text.split(/\s+/)) {
      const index = vocabulary.indexOf(word);
      if (index < 0) {
        steps.push({ op: 'note', line: 2, note: note(`Ignore ${word}: this teaching model deliberately uses only two vocabulary features.`, `${word} বাদ: শেখার এই মডেলে স্পষ্টভাবে শুধু দুটি word ফিচার রাখা হয়েছে।`) });
      } else {
        ++counts[label][index];
        steps.push({ op: 'table-set', table: 'counts', r: label, c: index, value: counts[label][index], line: 2,
          note: note(`Add the occurrence of ${word} to class ${label}; repeated words count repeatedly.`, `${word} শব্দটি লেবেল ${label}-এ যোগ করো; পুনরাবৃত্তি হলে আবার গুনো।`) });
      }
    }
  }
  const probability = [[0, 0], [0, 0]], scores = [0, 0];
  for (const label of [0, 1]) {
    const prior = documents[label] / messages.length;
    scores[label] = Math.log(prior);
    steps.push({ op: 'table-set', table: 'priors', r: label, c: 1, value: round(prior), line: 3,
      note: note(`Class prior is ${documents[label]}/${messages.length}=${round(prior)}.`, `Class prior ${documents[label]}/${messages.length}=${round(prior)}।`) });
    const total = counts[label][0] + counts[label][1];
    for (let word = 0; word < 2; ++word) {
      probability[label][word] = (counts[label][word] + input.alpha) / (total + input.alpha * 2);
      steps.push({ op: 'table-set', table: 'likelihood', r: label, c: word, value: round(probability[label][word]), line: 4,
        note: note(`Add alpha=${input.alpha}: (${counts[label][word]}+alpha)/(${total}+2×alpha)=${round(probability[label][word])}.`,
          `Smoothing-এ alpha=${input.alpha} যোগ হয়: (${counts[label][word]}+alpha)/(${total}+2×alpha)=${round(probability[label][word])}।`) });
    }
  }
  const words = input.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  for (const word of words) {
    const index = vocabulary.indexOf(word);
    if (index < 0) {
      steps.push({ op: 'note', line: 5, note: note(`Query word ${word} is outside the fixed vocabulary; it contributes no feature.`, `Query-এর ${word} স্থির vocabulary-তে নেই; এটি কোনো ফিচার যোগ করে না।`) });
      continue;
    }
    for (const label of [0, 1]) {
      scores[label] += Math.log(probability[label][index]);
      steps.push({ op: 'table-mark', table: 'likelihood', targets: [[label, index]], tone: 'current', line: 5,
        note: note(`For class ${label}, add log P(${word}|class); cumulative log score ${round(scores[label])}.`,
          `লেবেল ${label}-এর জন্য ${word}-এর log probability যোগ করো; মোট ${round(scores[label])}।`) });
    }
  }
  for (const label of [0, 1]) steps.push({ op: 'series-add', id: 'scores', x: String(label), y: scores[label], line: 6,
    note: note(`Class ${label} joint log score is ${round(scores[label])}; larger is better.`, `লেবেল ${label}-এর joint log score ${round(scores[label])}; বড়টি বেছে নাও।`) });
  const prediction = Number(scores[1] > scores[0]);
  steps.push({ op: 'note', line: 7, vars: { prediction, logScore0: round(scores[0]), logScore1: round(scores[1]) },
    note: note(`Predict ${prediction}; equal scores select zero. These joint scores are not normalised probabilities.`, `লেবেল ${prediction} নাও; সমান score-এ শূন্য। এই joint score স্বাভাবিক করা probability নয়।`) });
  steps.push({ op: 'done', line: 8, note: note('Try a Bangla query, a repeated word or an unknown word and inspect the changed evidence.', 'বাংলা query, একই শব্দ বারবার বা অচেনা শব্দ দিয়ে প্রমাণের বদল দেখো।') });
  return { init, steps };
}
