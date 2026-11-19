// Loop & Logic — lab format 1.1 for Node: the state model (lab-model.mjs) plus a sandbox
// that runs trace.js. Spec: content-kit/LAB_FORMAT.md

import vm from 'node:vm';
import { FORBIDDEN, LabError } from './lab-model.mjs';

export * from './lab-model.mjs';

const clone = (v) => JSON.parse(JSON.stringify(v));

export function loadTrace(source) {
  const m = FORBIDDEN.exec(source);
  if (m) throw new LabError(`trace.js may not use "${m[0]}" (pure, deterministic JavaScript only)`);
  const safeMath = Object.freeze(Object.fromEntries(Object.getOwnPropertyNames(Math).filter((k) => k !== 'random').map((k) => [k, Math[k]])));
  const context = vm.createContext({ Math: safeMath, JSON, Number, String, Array, Object, Boolean, Infinity, NaN, isFinite, parseInt, parseFloat, Map, Set });
  vm.runInContext(`${source}\n;this.__trace = typeof trace === 'function' ? trace : undefined;`, context, { timeout: 1000 });
  if (typeof context.__trace !== 'function') throw new LabError('trace.js must define function trace(input)');
  return (input) => vm.runInContext('__trace(__input)', Object.assign(context, { __input: clone(input) }), { timeout: 1000 });
}

