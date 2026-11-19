"""Independently audit broadcasting against NumPy and verify computed quiz pictures."""
import ast
import hashlib
import json
import os
from pathlib import Path
import runpy
import subprocess
import sys

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
MODULE = ROOT / "topics/python-for-ml"
LAB = MODULE / "ml-numpy-math/labs/broadcasting"


def run_saved(program):
    result = subprocess.run([sys.executable, "-I", "-X", "utf8", str(program)],
                            capture_output=True, check=True, env=os.environ.copy())
    assert not result.stderr, result.stderr.decode()
    assert result.stdout == program.with_suffix(".out").read_bytes(), program


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    metadata = json.loads((LAB / "lab.json").read_text())
    inputs = [p["input"] for p in metadata["presets"]]
    inputs.extend(c["input"] for c in metadata["checks"])
    rng = np.random.default_rng(2026)
    for mode in ["row", "column"]:
        for _ in range(50):
            inputs.append({"mode": mode,
                           "offsetA": int(rng.integers(-20, 21)),
                           "offsetB": int(rng.integers(-20, 21)),
                           "columnOffsets": rng.integers(-20, 21, size=5).tolist(),
                           "values": rng.integers(-20, 21, size=10).tolist()})
    javascript = """
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {join} from 'node:path';
const [kit, lab] = process.argv.slice(1);
const {loadTrace, playTrace} = await import(pathToFileURL(join(kit, 'tools/labs.mjs')));
const metadata = JSON.parse(fs.readFileSync(join(lab, 'lab.json'), 'utf8'));
const trace = loadTrace(fs.readFileSync(join(lab, 'trace.js'), 'utf8'));
const inputs = JSON.parse(fs.readFileSync(0, 'utf8'));
const results = inputs.map(input => {
  const result = trace(input);
  if (JSON.stringify(result) !== JSON.stringify(trace(input))) throw Error('Not deterministic');
  const before = JSON.stringify(result);
  const state = playTrace('ml', result, {lines: metadata.pseudocode.length});
  if (JSON.stringify(result) !== before) throw Error('Playback mutated the trace');
  return {state, length: result.steps.length, init: result.init};
});
process.stdout.write(JSON.stringify(results));
"""
    result = subprocess.run(["node", "--input-type=module", "-e", javascript,
                             str(ROOT.parents[1]), str(LAB)],
                            input=json.dumps(inputs), text=True,
                            capture_output=True, check=False)
    assert result.returncode == 0, result.stderr
    assert not result.stderr, result.stderr
    outcomes = json.loads(result.stdout)
    for supplied, outcome in zip(inputs, outcomes):
        X = np.array(supplied["values"]).reshape(5, 2)
        if supplied["mode"] == "row":
            offsets = np.array([supplied["offsetA"], supplied["offsetB"]])
        else:
            offsets = np.array(supplied["columnOffsets"]).reshape(5, 1)
        expected = X + offsets
        state = outcome["state"]
        assert state["tables"]["result"]["cells"] == expected.tolist()
        assert state["vars"]["total"] == int(expected.sum())
        assert state["tables"]["x"]["cells"] == X.tolist()
        assert outcome["init"]["tables"]["x"]["cells"] == X.tolist()
        assert 20 <= outcome["length"] <= 400
    # Default lab and both student programs must agree on every result cell, not only the total.
    for name in ["ex-1", "ex-2"]:
        recorded = (MODULE / f"ml-numpy-math/examples/{name}.out").read_text()
        parsed = ast.literal_eval(recorded.splitlines()[0].split(": ", 1)[1])
        assert parsed == outcomes[0]["state"]["tables"]["result"]["cells"]
        assert recorded.splitlines()[1] == f"Total: {outcomes[0]['state']['vars']['total']}"
    print(f"Broadcasting: {len(outcomes)} traces match independent NumPy additions, "
          "including row/column, negative and zero inputs; default matches both examples.")

    builder = runpy.run_path(str(ROOT / "shared/make_python_figures.py"))
    figures = builder["build"]()
    assert figures == json.loads((ROOT / "shared/python-figures.json").read_text())
    worksheet = MODULE / "ml-python-practice-sheet"
    assets = worksheet / "assets/worksheet-scatter.png"
    before = [digest(ROOT / "shared/python-figures.json"), digest(assets)]
    run_saved(ROOT / "shared/make_python_figures.py")
    assert before == [digest(ROOT / "shared/python-figures.json"), digest(assets)]
    figure_count = output_count = code_count = 0
    for folder in sorted(MODULE.iterdir()):
        topic = json.loads((folder / "topic.json").read_text())
        for quiz in topic["quiz"]:
            if "figure" in quiz:
                assert quiz["figure"] in figures.values()
                figure_count += 1
            output_count += quiz["type"] == "output"
        for entry in topic["examples"] + topic["practice"]:
            path = entry.get("file", entry.get("solution"))
            if not path:
                continue
            source = (folder / path).read_text()
            imports = set()
            for node in ast.walk(ast.parse(source)):
                if isinstance(node, ast.Import):
                    imports.update(a.name.split(".")[0] for a in node.names)
                elif isinstance(node, ast.ImportFrom):
                    imports.add(node.module.split(".")[0])
            needed = imports & {"numpy", "pandas", "sklearn", "matplotlib"}
            assert needed == set(entry.get("requires", [])), path
            code_count += 1
        body = (folder / "body.en.html").read_text()
        assert 'class="callout story"' in body
        if topic["kind"] == "lesson":
            assert 'class="callout unplugged"' in body
            assert 'id="going-deeper"' in body
    sheet = json.loads((worksheet / "topic.json").read_text())
    worksheet_figures = [figures[name] for name in ["shape", "groups", "scatter"]]
    assert [q["figure"] for q in sheet["quiz"][:3]] == worksheet_figures
    assert np.array(figures["row-add"]["panels"]["tables"]["result"]["cells"]).sum() == 195
    print(f"Eight topics: {code_count} example/solution package declarations, "
          f"{figure_count} computed picture questions and {output_count} output quizzes audited.")
    print("Worksheet picture data and exact figure rebuild match; "
          "all seven lessons have stories, unplugged activities and deeper sections.")


if __name__ == "__main__":
    main()
