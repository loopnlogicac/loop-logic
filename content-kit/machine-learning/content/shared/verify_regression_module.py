"""Independently check regression traces against NumPy and scikit-learn."""
import copy
import json
from pathlib import Path
import subprocess

import numpy as np
from sklearn.linear_model import LinearRegression, Ridge

ROOT = Path(__file__).resolve().parents[1]
KIT = ROOT.parents[1]
BASE = ROOT / "topics/regression"
RNG = np.random.default_rng(2026)


def close(actual, expected, atol=0.0011):
    np.testing.assert_allclose(np.asarray(actual, dtype=float),
                               np.asarray(expected, dtype=float), rtol=1e-8, atol=atol)


def replay(path, inputs):
    runner = """
import fs from 'node:fs';
import {loadTrace, playTrace} from './tools/labs.mjs';
const request = JSON.parse(fs.readFileSync(0, 'utf8'));
const source = fs.readFileSync(request.path + '/trace.js', 'utf8');
const lab = JSON.parse(fs.readFileSync(request.path + '/lab.json', 'utf8'));
const trace = loadTrace(source);
const output = request.inputs.map(input => {
  const before = JSON.stringify(input);
  const result = trace(input);
  if (before !== JSON.stringify(input)) throw Error('input mutation');
  if (JSON.stringify(result) !== JSON.stringify(trace(input))) throw Error('non-determinism');
  return {state: playTrace('ml',result,{lines:lab.pseudocode.length}),
          init:result.init, steps:result.steps};
});
process.stdout.write(JSON.stringify(output));
"""
    result = subprocess.run(
        ["node", "--input-type=module", "-e", runner], cwd=KIT,
        input=json.dumps(dict(path=str(path), inputs=inputs)),
        text=True, capture_output=True, check=True)
    assert not result.stderr, result.stderr
    return json.loads(result.stdout)


def verify(lab_id, inp, result):
    state, steps = result["state"], result["steps"]
    var = state["vars"]
    x = np.array([p["x"] for p in inp["points"]], dtype=float)
    y = np.array([p["y"] for p in inp["points"]], dtype=float)
    if lab_id == "least-squares":
        model = LinearRegression().fit(x[:, None], y)
        close(var["slope"], model.coef_[0])
        close(var["intercept"], model.intercept_)
        close(var["mse"], np.mean((y-model.predict(x[:, None]))**2))
        for index in range(len(x)):
            segment = state["plot"]["shapes"][f"gapp{index}"]
            close(segment["from"], [x[index], model.predict([[x[index]]])[0]], 1e-8)
            close(segment["to"], [x[index], y[index]], 1e-8)
    elif lab_id == "cost-explorer":
        b, w = inp["intercept"], inp["slope"]
        grid = np.arange(-10, 41)/10
        costs = [np.mean((y-slope*x-b)**2) for slope in grid]
        close(state["chart"]["series"]["cost"]["points"], list(zip(grid, costs)), 1e-8)
        close(var["mse"], np.mean((y-w*x-b)**2))
        close(var["bestSlope"], grid[np.argmin(costs)])
        close(var["bestMse"], min(costs))
    elif lab_id == "gradient-descent":
        w = b = 0.0
        expected = [[0, np.mean(y**2)]]
        lines = [s for s in steps if s["op"] == "shape"]
        assert len(lines) == inp["iterations"]
        for iteration in range(1, inp["iterations"]+1):
            error = w*x+b-y
            grad = 2*np.column_stack([x, np.ones(len(x))]).T @ error / len(x)
            w, b = np.array([w, b])-inp["lr"]*grad
            cost = np.mean((y-w*x-b)**2)
            expected.append([iteration, cost])
            close(lines[iteration-1]["w"], [w, -1], 1e-8)
            close(lines[iteration-1]["b"], b, 1e-8)
            pos = next(k for k, s in enumerate(steps) if s is lines[iteration-1])
            assert steps[pos+1]["op"] == "series-add"
            close(steps[pos+1]["y"], cost, 1e-8)
        close(state["chart"]["series"]["loss"]["points"], expected, 1e-8)
        close(var["slope"], w)
        close(var["intercept"], b)
        close(var["mse"], expected[-1][1])
    elif lab_id == "polynomial-fit":
        vx = np.linspace(-0.95, 0.95, 30)
        vy = 2+vx-2*vx**2+vx**3
        curves = [s for s in steps if s["op"] == "shape"][:12]
        for degree in range(1, 13):
            # For exact repeated x, the disclosed omitted-column convention keeps
            # the first k independent powers: the unique degree k-1 interpolant.
            rank_degree = min(degree, len(np.unique(x))-1)
            A = np.vander(x, rank_degree+1, increasing=True)
            weights = np.linalg.lstsq(A, y, rcond=None)[0]
            train = np.mean((y-A@weights)**2)
            val = np.mean((vy-np.vander(vx, rank_degree+1, increasing=True)@weights)**2)
            train_point = state["chart"]["series"]["train"]["points"][degree-1]
            valid_point = state["chart"]["series"]["validation"]["points"][degree-1]
            close(train_point, [degree, train], 1e-5)
            close(valid_point, [degree, val], 1e-4)
            curve = np.asarray(curves[degree-1]["points"])
            close(curve[:, 1], np.polynomial.polynomial.polyval(curve[:, 0], weights), 1e-4)
        chosen = inp["degree"]-1
        close(var["trainMse"], state["chart"]["series"]["train"]["points"][chosen][1])
        close(var["validationMse"], state["chart"]["series"]["validation"]["points"][chosen][1])
    elif lab_id == "ridge-shrink":
        powers = np.column_stack([x**j for j in range(1, 9)])
        means, scales = powers.mean(axis=0), powers.std(axis=0)
        scales[scales == 0] = 1
        Z = (powers-means)/scales
        model = Ridge(alpha=inp["alpha"], solver="cholesky").fit(Z, y)
        close(var["weightNorm"], np.linalg.norm(model.coef_))
        close(var["trainMse"], np.mean((y-model.predict(Z))**2))
        curve = np.array(state["plot"]["shapes"]["fit"]["points"])
        query = np.column_stack([curve[:, 0]**j for j in range(1, 9)])
        close(curve[:, 1], model.predict((query-means)/scales), 1e-7)
        norms = state["chart"]["series"]["norm"]["points"]
        for alpha, norm in norms:
            check = Ridge(alpha=alpha, solver="cholesky").fit(Z, y)
            close(norm, np.linalg.norm(check.coef_), 1e-7)
        assert np.all(np.diff([norm for _, norm in norms]) <= 1e-9)


def main():
    total = 0
    for lab_file in sorted(BASE.glob("*/labs/*/lab.json")):
        lab = json.loads(lab_file.read_text())
        inputs = [p["input"] for p in lab["presets"]] + [p["input"] for p in lab["checks"]]
        n_presets = len(lab["presets"])
        for _ in range(30):
            inp = copy.deepcopy(inputs[0])
            for field in lab["inputs"]:
                name = field["name"]
                if field["type"] == "points":
                    count = int(RNG.integers(field["minLength"], field["maxLength"]+1))
                    inp[name] = [dict(x=float(RNG.uniform(*field["xRange"])),
                                      y=float(RNG.uniform(*field["yRange"]))) for _ in range(count)]
                elif field["type"] in ["number", "int"]:
                    step = field.get("step", 1)
                    slots = round((field["max"]-field["min"])/step)
                    inp[name] = round(field["min"]+int(RNG.integers(slots+1))*step, 8)
            inputs.append(inp)
        for constant in [0.0, 1.0]:
            inp = copy.deepcopy(inputs[0])
            inp["points"] = [dict(x=constant, y=float(j % 5)) for j in range(len(inp["points"]))]
            inputs.append(inp)
        results = replay(lab_file.parent, inputs)
        for index, (inp, result) in enumerate(zip(inputs, results)):
            if index < n_presets:
                assert 20 <= len(result["steps"]) <= 400
            verify(lab["id"], inp, result)
            total += 1
        print(f"{lab['id']}: {len(results)} independently verified traces")
    figures = json.loads((ROOT / "shared/regression-figures.json").read_text())
    for topic_file in BASE.glob("*/topic.json"):
        topic = json.loads(topic_file.read_text())
        for question in topic["quiz"]:
            if "figure" in question:
                assert question["figure"] in figures.values()
        for item in topic["examples"] + topic["practice"]:
            if item.get("type") == "written":
                continue
            source = topic_file.parent / item.get("file", item.get("solution"))
            compile(source.read_text(), str(source), "exec", dont_inherit=True)
        if topic["labs"]:
            out1 = (topic_file.parent / "examples/ex-1.out").read_text()
            out2 = (topic_file.parent / "examples/ex-2.out").read_text()
            assert out1 == out2, topic["id"]
    manifest = json.loads((ROOT / "manifest.json").read_text())
    assert manifest["packageVersion"] == "0.5.0"
    print(f"PASS: {total} traces, deterministic replay, default example pairs and figure provenance.")


if __name__ == "__main__":
    main()
