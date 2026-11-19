"""Compute quiz panels and printable SVGs from the course's actual card data."""
import copy
import csv
import json
import runpy
from collections import Counter
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOPICS = ROOT / "topics/ml-for-everyone"


def table(name, columns, rows):
    return {"tables": {name: {"rows": len(rows), "cols": len(columns),
                              "colLabels": columns, "cells": rows}}}


def figure(en, bn, panels):
    return {"caption": {"en": en, "bn": bn}, "panels": panels}


def build():
    with (ROOT / "shared/datasets/tiny_fruits.csv").open(encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    points = [
        {"id": f"p{i + 1}", "x": float(row["size_cm"]),
         "y": float(row["sweetness"]), "cls": int(row["label"] == "mango"),
         "label": f"p{i + 1}"}
        for i, row in enumerate(rows)
    ]
    plot = {
        "xRange": [0, 10], "yRange": [0, 10], "xLabel": "Size (cm)",
        "yLabel": "Sweetness (0–10)",
        "classes": [{"id": 0, "label": "Apple / আপেল"},
                    {"id": 1, "label": "Mango / আম"}], "points": points,
    }
    cards = [[p["id"], p["x"], p["y"], ["Apple", "Mango"][p["cls"]]] for p in points]
    fruit_panels = {"plot": plot, **table("cards", ["Card", "Size", "Sweetness", "Label"], cards)}
    figures = {"fruits": figure(
        "Ten fruit cards and their exact two-feature positions.",
        "দশ ফলের কার্ড আর দুই feature-এর ঠিক অবস্থান।", fruit_panels,
    )}
    for threshold in [3, 4, 5]:
        fenced = copy.deepcopy(plot)
        fenced["shapes"] = {"fence": {
            "type": "line", "w": [1, 0], "b": -threshold,
            "label": f"Apple through {threshold}", "tone": "current",
        }}
        figures[f"fence{threshold}"] = figure(
            f"Predict Apple on or left of size {threshold}; Mango on the right.",
            f"আকার {threshold} বা বাঁয়ে আপেল, ডানে আম অনুমান।", {"plot": fenced},
        )
    errors = [[t, sum(int(p["x"] > t) != p["cls"] for p in points)] for t in [3, 4, 5, 6]]
    figures["thresholds"] = figure(
        "Actual mistake counts for four trial fences.", "চারটি ভাগের রেখায় গোনা আসল ভুল।",
        {"chart": {"xLabel": "Dividing size", "yLabel": "Mistakes", "series": [
            {"id": "errors", "label": "Mistakes / ভুল", "type": "line", "points": errors},
        ]}},
    )
    animals = [
        ["A", "Striped", "Pointed", "Cat"], ["B", "White", "Curled tail", "Cat"],
        ["C", "Black kitten", "Short tail", "Cat"], ["D", "Brown", "Floppy", "Dog"],
        ["E", "Spotted", "Long muzzle", "Dog"], ["F", "Small dog", "Pointed", "Dog"],
    ]
    figures["animals"] = figure(
        "Six named animal cards; pointed ears occur in both kinds.",
        "ছয় প্রাণীর নামসহ কার্ড; দুই দলেই খাড়া কান আছে।",
        table("animals", ["Card", "Look", "Clue", "Answer"], animals),
    )
    watches = ["Cricket", "Drawing", "Cricket", "Drawing", "Cooking", "Cricket"]
    watch_counts = Counter(watches)
    figures["apps"] = figure(
        "Six viewing cards: count topics, not a person's whole personality.",
        "ছয় দেখা ভিডিওর বিষয় গোনো; মানুষের পুরো স্বভাব নয়।",
        {"chart": {"xLabel": "Video topic", "yLabel": "Viewed cards", "series": [
            {"id": "views", "label": "Views / দেখা", "type": "bar",
             "points": [[name, count] for name, count in watch_counts.items()]},
        ]}},
    )
    endings = ["আসব", "খেলব", "আসব", "পড়ব", "আসব", "খেলব"]
    word_counts = Counter(endings)
    figures["words"] = figure(
        "Six invented continuations after কাল সকালে; frequency does not establish intention.",
        "কাল সকালে-এর পরে ছয়টি বানানো শব্দ; বেশি দেখা মানে মনের ইচ্ছা জানা নয়।",
        {"chart": {"xLabel": "Next word", "yLabel": "Occurrences", "series": [
            {"id": "words", "label": "Count / সংখ্যা", "type": "bar",
             "points": [[name, count] for name, count in word_counts.items()]},
        ]}},
    )
    toys = [(1, 2), (2, 2), (2, 3), (7, 7), (8, 7), (8, 8)]
    figures["groups"] = figure(
        "Six toy measurements without supplied class labels.", "দলের label ছাড়া ছয় খেলনার মাপ।",
        {"plot": {"xRange": [0, 10], "yRange": [0, 10], "xLabel": "Toy size",
                  "yLabel": "Colour score", "points": [
                      {"id": f"t{i + 1}", "x": x, "y": y} for i, (x, y) in enumerate(toys)
                  ]}},
    )
    figures["learning"] = figure(
        "Three games offer different kinds of feedback.", "তিন খেলায় তিন ধরনের সাহায্য।",
        table("games", ["Game", "Help supplied"], [
            ["Fruit name", "Known answers"], ["Toy groups", "No names"],
            ["Maze moves", "Later reward"],
        ]),
    )
    reference = runpy.run_path(str(TOPICS / "ml-train-and-test/labs/exam-split/reference.py"))
    _, counts = reference["score"](reference["POINTS"], 4)
    figures["exam"] = figure(
        "Six training and four hidden cards: counts from three fitted size-only rules.",
        "ছয় training, চার test কার্ডে তিন আকারভিত্তিক নিয়মের ভুল।",
        {"chart": {"xLabel": "Rule", "yLabel": "Mistakes (train 6, test 4)", "series": [
            {"id": "train", "label": "Training / শেখা", "type": "bar",
             "points": [[name, pair[0]] for name, pair in counts.items()]},
            {"id": "test", "label": "Hidden test / পরীক্ষা", "type": "bar",
             "points": [[name, pair[1]] for name, pair in counts.items()]},
        ]}},
    )
    split = [[f"p{i + 1}", "Training" if i < 6 else "Test hidden"] for i in range(10)]
    figures["split"] = figure(
        "The first six cards train; the last four answers stay sealed until prediction.",
        "প্রথম ছয়টিতে শেখা, শেষ চারটির উত্তর অনুমানের আগে ঢাকা।",
        table("split", ["Card", "Role"], split),
    )
    workflow = [
        ["A", "No", "Yes", "Busy"], ["B", "No", "No", "Busy"],
        ["C", "Yes", "Yes", "Quiet"], ["D", "Yes", "No", "Quiet"],
        ["E", "No", "Yes", "Busy"], ["F", "Yes", "Yes", "Quiet"],
    ]
    figures["workflow"] = figure(
        "Six invented training mornings; clues are known before the stall opens.",
        "ছয় বানানো সকাল; দোকান খোলার আগে ইঙ্গিত জানা।",
        table("mornings", ["Card", "Rain", "School open", "Answer"], workflow),
    )
    opportunities = [("Early bus", True)] * 3 + [("Late bus", False)] * 3
    race_rows = [
        [group, sum(g == group and recorded for g, recorded in opportunities)]
        for group in ["Early bus", "Late bus"]
    ]
    figures["race"] = figure(
        "Recorded race opportunities, not running speeds: "
        "three early-bus records and no late-bus records.",
        "এটি দৌড়ের সুযোগ, গতি নয়: আগের বাসে তিন রেকর্ড, দেরির বাসে নেই।",
        table("races", ["Group", "Race records"], race_rows),
    )
    figures["permission"] = figure(
        "Permission for one purpose does not silently extend to another.",
        "এক কাজের অনুমতি নিজে থেকে অন্য কাজে যায় না।",
        table("permission", ["Use", "Permission"], [
            ["Private class drawing", "Agreed"], ["Public face upload", "Not asked"],
        ]),
    )
    return figures



def svg(panels):
    """Small dependency-free renderer of these fixed plot/chart/table panels."""
    panels = list(panels.items())
    width, height = 980, 420 * len(panels)
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" '
        f'height="{height}" viewBox="0 0 {width} {height}">',
             '<rect width="100%" height="100%" fill="#fff"/>']

    def text(x, y, value, size=16):
        parts.append(
            f'<text x="{x}" y="{y}" font-family="sans-serif" '
            f'font-size="{size}" fill="#172554">{escape(str(value))}</text>'
        )

    colours = ["#1d4ed8", "#c2410c"]
    for panel_index, (kind, panel) in enumerate(panels):
        top = panel_index * 420
        if kind == "plot":
            x0, y0, scale = 75, top + 350, 29
            parts.append(f'<path d="M75,{top + 40} V{y0} H400" fill="none" stroke="#334155"/>')
            for tick in range(11):
                text(x0 + tick * scale - 4, y0 + 22, tick, 12)
                text(45, y0 - tick * scale + 4, tick, 12)
            text(100, y0 + 48, panel.get("xLabel", "x"))
            text(30, top + 22, panel.get("yLabel", "y"))
            for shape in panel.get("shapes", {}).values():
                if shape["type"] == "line":
                    t = -shape["b"] / shape["w"][0]
                    x = x0 + t * scale
                    parts.append(
                        f'<path d="M{x},{y0} V{top + 45}" stroke="#0f766e" '
                        'stroke-width="3" fill="none"/>'
                    )
                    text(440, top + 110, shape.get("label", "Fence"))
            for point in panel.get("points", []):
                x, y = x0 + point["x"] * scale, y0 - point["y"] * scale
                cls = point.get("cls")
                colour = colours[cls] if cls is not None else "#475569"
                parts.append(f'<circle cx="{x}" cy="{y}" r="6" fill="{colour}"/>')
                text(x + 8, y - 6, point["id"], 13)
            for i, cls in enumerate(panel.get("classes", [])):
                parts.append(
                    f'<rect x="440" y="{top + 31 + i * 27}" '
                    f'width="16" height="16" fill="{colours[i]}"/>'
                )
                text(468, top + 45 + i * 27, cls["label"])
        elif kind == "chart":
            series = panel["series"]
            categories = [p[0] for p in series[0]["points"]]
            largest = max(p[1] for s in series for p in s["points"])
            unit = 230 / max(1, largest)
            parts.append(
                f'<path d="M75,{top + 55} V{top + 320} H900" '
                'fill="none" stroke="#334155"/>'
            )
            for i, category in enumerate(categories):
                for j, sr in enumerate(series):
                    x, value = 130 + i * 230 + j * 60, sr["points"][i][1]
                    parts.append(
                        f'<rect x="{x}" y="{top + 320 - value * unit}" '
                        f'width="45" height="{value * unit}" fill="{colours[j]}"/>'
                    )
                    text(x + 12, top + 310 - value * unit, value)
                text(130 + i * 230, top + 350, category)
            text(30, top + 25, panel.get("yLabel", "Count"))
            for j, sr in enumerate(series):
                parts.append(
                    f'<rect x="{90 + j * 350}" y="{top + 380}" '
                    f'width="18" height="18" fill="{colours[j]}"/>'
                )
                text(120 + j * 350, top + 395, sr["label"])
        elif kind == "tables":
            grid = next(iter(panel.values()))
            columns = grid["colLabels"]
            cell_width = 900 / len(columns)
            row_height = min(32, 340 / (grid["rows"] + 1))
            for r, row in enumerate([columns] + grid["cells"]):
                for c, value in enumerate(row):
                    x, y = 35 + c * cell_width, top + 25 + r * row_height
                    fill = "#dbeafe" if r == 0 else "#f8fafc"
                    parts.append(
                        f'<rect x="{x}" y="{y}" width="{cell_width}" '
                        f'height="{row_height}" fill="{fill}" stroke="#64748b"/>'
                    )
                    display = f"{value:g}" if isinstance(value, float) else value
                    text(x + 8, y + row_height * 0.72, display, 15)
    return "\n".join(parts + ["</svg>\n"])


def main():
    figures = build()
    (ROOT / "shared/figures.json").write_text(
        json.dumps(figures, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    assets = TOPICS / "ml-everyone-practice-sheet/assets"
    assets.mkdir(exist_ok=True)
    for index, name in enumerate(["fruits", "fence4", "groups", "exam", "race"], 1):
        (assets / f"warm-up-{index}.svg").write_text(svg(figures[name]["panels"]), encoding="utf-8")
    print(f"Computed {len(figures)} panel figures and 5 printable worksheet pictures.")


if __name__ == "__main__":
    main()
