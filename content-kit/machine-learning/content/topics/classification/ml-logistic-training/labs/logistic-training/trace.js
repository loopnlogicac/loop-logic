function trace(input) {
  const sigmoid = z => z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z));
  const round = v => Math.round(v * 1000) / 1000;
  const note = (en, bn) => ({ en, bn });
  const points = input.points.map((p, i) => ({ ...p, id: 'p' + i }));
  const strength = 1 / (input.c * points.length);
  let w = [0.4, -0.2], bias = 0.5, status = 'finished', hasBoundary = false;
  function objective() {
    let loss = 0;
    for (const p of points) {
      const z = w[0] * p.x + w[1] * p.y + bias;
      loss += Math.max(z, 0) - p.cls * z + Math.log1p(Math.exp(-Math.abs(z)));
    }
    return loss / points.length + strength * (w[0] * w[0] + w[1] * w[1]) / 2;
  }
  const init = { plot: {
    xRange: [-3, 3], yRange: [-3, 3], xLabel: 'Centred feature one', yLabel: 'Centred feature two',
    classes: [{ id: 0, label: 'Apple' }, { id: 1, label: 'Mango' }], points
  }, chart: { xLabel: 'Epoch', yLabel: 'Mean log loss + L2 penalty',
    series: [{ id: 'loss', label: 'Objective', type: 'line', points: [[0, objective()]] }] } };
  const steps = [{ op: 'note', line: 1, note: note(
    `Start at weights (0.4,-0.2), bias 0.5; L2 strength is 1/(C×n)=${round(strength)}.`,
    `শুরুতে weight (0.4,-0.2), bias 0.5; L2-এর জোর 1/(C×n)=${round(strength)}।`) }];
  let loss = objective();
  for (let epoch = 1; epoch <= input.epochs; ++epoch) {
    const gradient = [strength * w[0], strength * w[1]];
    let gb = 0;
    for (const p of points) {
      const error = sigmoid(w[0] * p.x + w[1] * p.y + bias) - p.cls;
      gradient[0] += error * p.x / points.length;
      gradient[1] += error * p.y / points.length;
      gb += error / points.length;
    }
    w = [w[0] - input.rate * gradient[0], w[1] - input.rate * gradient[1]];
    bias -= input.rate * gb;
    loss = objective();
    if (Math.max(Math.abs(w[0]), Math.abs(w[1]), Math.abs(bias)) > 1000000) status = 'diverged';
    if (epoch <= 10 || epoch % 10 === 0 || epoch === input.epochs || status === 'diverged') {
      steps.push({ op: 'note', line: 3, note: note(
        `Epoch ${epoch}: gradient (${round(gradient[0])},${round(gradient[1])}), bias gradient ${round(gb)}. ${epoch > 10 ? 'Only every tenth epoch is displayed after the first ten.' : 'Update all parameters from the same old state.'}`,
        `Epoch ${epoch}-এ gradient (${round(gradient[0])},${round(gradient[1])}), bias-এর gradient ${round(gb)}। ${epoch > 10 ? 'প্রথম দশটির পর প্রতি দশম epoch দেখানো হচ্ছে।' : 'একই পুরোনো মান থেকে সব parameter বদলাও।'}`) });
      if (Math.hypot(w[0], w[1]) > 1e-12) {
        hasBoundary = true;
        steps.push({ op: 'shape', id: 'boundary', type: 'line', w: [...w], b: bias, line: 4,
          note: note(`Epoch ${epoch} boundary uses the updated weights and bias; its objective is ${round(loss)}.`,
            `Epoch ${epoch}-এর নতুন weight ও bias-এ boundary; একই মানে objective ${round(loss)}।`) });
      } else if (hasBoundary) {
        hasBoundary = false;
        steps.push({ op: 'shape-remove', id: 'boundary', line: 4, note: note('Zero weights imply a constant score rather than a separating line.', 'Weight শূন্য হলে সোজা বিভাজক রেখার বদলে স্থির score হয়।') });
      } else {
        steps.push({ op: 'note', line: 4, note: note('The current weights give a constant score, so no line is drawn.', 'এখনকার weight-এ score স্থির, তাই রেখা আঁকা হয়নি।') });
      }
      steps.push({ op: 'series-add', id: 'loss', x: epoch, y: loss, line: 5,
        note: note(`Record the objective for the same epoch ${epoch}; compare it with the preceding boundary update.`,
          `একই epoch ${epoch}-এর objective chart-এ রাখো; আগের boundary update-এর সঙ্গে মেলাও।`) });
    }
    if (status === 'diverged') {
      steps.push({ op: 'note', line: 6, note: note('The large learning rate drove a parameter beyond one million; stop before numerical overflow. This run did not converge.', 'বড় learning rate-এ parameter দশ লাখ ছাড়িয়েছে; overflow-এর আগেই থামো। এটি converge করেনি।') });
      break;
    }
  }
  const cells = Array.from({ length: 24 }, (_, r) => Array.from({ length: 24 }, (_, c) => {
    const x = -3 + (c + 0.5) * 6 / 24, y = 3 - (r + 0.5) * 6 / 24;
    return Number(sigmoid(w[0] * x + w[1] * y + bias) >= 0.5);
  }));
  steps.push({ op: 'regions', rows: 24, cols: 24, mode: 'class', cells, line: 7,
    vars: { w1: round(w[0]), w2: round(w[1]), bias: round(bias), loss: round(loss), status },
    note: note(`Final status ${status}; the map evaluates the actual final model, not a hand-drawn fence.`,
      `শেষ status ${status}; মানচিত্রে সত্যিকারের শেষ মডেল চালানো হয়েছে।`) });
  steps.push({ op: 'done', line: 8, note: note('Compare a cautious step with the divergent preset and keep convergence separate from generalisation.', 'ছোট step ও diverge করা preset মেলাও; convergence আর নতুন ডেটায় ভালো ফল আলাদা।') });
  return { init, steps };
}
