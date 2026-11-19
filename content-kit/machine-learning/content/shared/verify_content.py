"""Audit content-specific invariants beyond the standard package checker."""
import csv
import hashlib
import importlib.metadata
import json
import re
import runpy
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def run(program):
    if program.suffix == ".mjs":
        command = ["node", str(program)]
    else:
        command = [sys.executable, "-I", "-X", "utf8", str(program)]
    result = subprocess.run(command, capture_output=True, check=True)
    assert not result.stderr, result.stderr.decode()
    recorded = program.with_suffix(".out")
    assert recorded.read_bytes() == result.stdout, f"Stale run: {recorded}"


def hashes(paths):
    return {str(p.relative_to(ROOT)): hashlib.sha256(p.read_bytes()).hexdigest() for p in paths}


def main():
    requirements = {"numpy": (2, 0), "pandas": (2, 2),
                    "scikit-learn": (1, 5), "matplotlib": (3, 8)}
    manifest = json.loads((ROOT / "manifest.json").read_text())
    for package, minimum in requirements.items():
        version = importlib.metadata.version(package)
        assert tuple(map(int, version.split(".")[:2])) >= minimum
        assert f"{package} {version}" in manifest["toolchain"]
    assert manifest["packageVersion"] == "0.3.0"
    print("Required packages match the recorded toolchain; packageVersion is 0.3.0.")

    datasets = ROOT / "shared/datasets"
    csv_paths = sorted(datasets.glob("*.csv"))
    original = hashes(csv_paths)
    for _ in range(2):
        run(datasets / "make_datasets.py")
        assert hashes(csv_paths) == original, "Dataset rebuild changed bytes"
    sizes = {"tiny_fruits": 10, "fruits": 120, "study": 200,
             "rent": 250, "sms": 160, "shop": 180}
    tables = {}
    for name, expected in sizes.items():
        with (datasets / f"{name}.csv").open(encoding="utf-8", newline="") as handle:
            tables[name] = list(csv.DictReader(handle))
        assert len(tables[name]) == expected
    for name in ["study", "rent"]:
        assert sum(value == "" for row in tables[name] for value in row.values()) == 6
    districts = {row["district"] for row in tables["rent"] if row["district"]}
    assert districts == {"Mirpur", "Dhanmondi", "Uttara", "Mohammadpur", "Badda"}
    assert float(tables["study"][-1]["hours_studied"]) > 24
    assert float(tables["rent"][-1]["rent_bdt"]) == 500000
    assert float(tables["shop"][-1]["avg_spend_bdt"]) == 18000
    assert len({row["customer_id"] for row in tables["shop"]}) == 180
    assert len({row["text"] for row in tables["sms"]}) == 160
    assert sum(row["label"] == "spam" for row in tables["sms"]) == 80
    bangla_messages = sum(
        bool(re.search(r"[\u0980-\u09ff]", row["text"])) for row in tables["sms"]
    )
    assert bangla_messages == 80
    print("Six datasets: row counts, missing cells, outliers, districts, "
          "unique messages and exact double rebuild passed.")

    builder = runpy.run_path(str(ROOT / "shared/make_figures.py"))
    expected_figures = builder["build"]()
    assert json.loads((ROOT / "shared/figures.json").read_text()) == expected_figures
    assets = ROOT / "topics/ml-for-everyone/ml-everyone-practice-sheet/assets"
    generated = [ROOT / "shared/figures.json", *sorted(assets.glob("*.svg"))]
    before = hashes(generated)
    run(ROOT / "shared/make_figures.py")
    assert hashes(generated) == before
    picture_names = ["fruits", "fence4", "groups", "exam", "race"]
    for index, name in enumerate(picture_names, 1):
        picture = (assets / f"warm-up-{index}.svg").read_text()
        assert picture == builder["svg"](expected_figures[name]["panels"])
    catalog = [figure for figure in expected_figures.values()]
    curriculum = json.loads((ROOT.parent / "spec/curriculum.json").read_text())["modules"][0]
    topic_count = question_count = picture_count = 0
    for plan in curriculum["topics"]:
        folder = ROOT / "topics/ml-for-everyone" / plan["id"]
        meta = json.loads((folder / "topic.json").read_text())
        assert meta["kind"] == plan["kind"]
        assert meta["examples"] == []  # Module 1 is explicitly a no-code course layer.
        assert all(q["type"] == "mcq" for q in meta["quiz"])
        figures = [q["figure"] for q in meta["quiz"] if "figure" in q]
        assert len(figures) >= plan["visualQuiz"]
        assert all(fig in catalog for fig in figures)
        en = (folder / "body.en.html").read_text()
        bn = (folder / "body.bn.html").read_text()
        assert len(re.findall(r"[\u0980-\u09ff]+", bn)) >= 400, plan["id"]
        assert re.findall(r'<h2 id="([^"]+)">', en) == re.findall(r'<h2 id="([^"]+)">', bn)
        assert re.findall(r'data-lab="([^"]+)"', en) == re.findall(r'data-lab="([^"]+)"', bn)
        assert '<div class="callout story">' in en and '<div class="callout story">' in bn
        if plan["kind"] == "theory":
            assert '<div class="callout unplugged">' in en
        topic_count += 1
        question_count += len(meta["quiz"])
        picture_count += len(figures)
    sheet = json.loads((assets.parent / "topic.json").read_text())
    worksheet_figures = [q["figure"] for q in sheet["quiz"][:5]]
    assert worksheet_figures == [expected_figures[name] for name in picture_names]
    print(f"{topic_count} bilingual topics, {question_count} quiz items and "
          f"{picture_count} picture questions checked against computed panels.")
    print("Five printable worksheet figures exactly match their quiz panels; "
          "Bangla sections and lab placements match English.")

    for program in sorted((ROOT / "topics").glob("*/*/labs/*/reference.py")):
        run(program)
    run(ROOT / "shared/verify_labs.mjs")
    print("All teacher references and lab audits reproduced their recorded real-run outputs.")


if __name__ == "__main__":
    main()
