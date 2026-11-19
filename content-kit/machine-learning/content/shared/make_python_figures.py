"""Build the Python module's quiz figures from real numeric operations."""
import json
from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
X = np.array([[2, 3], [3, 2], [4, 3], [6, 7], [7, 8]])


def table(name, rows, columns):
    return {"tables": {name: {"rows": len(rows), "cols": len(columns),
                              "colLabels": columns, "cells": rows}}}


def figure(en, bn, panels):
    return {"caption": {"en": en, "bn": bn}, "panels": panels}


def build():
    row = np.array([10, 20])
    col = np.arange(1, 6).reshape(5, 1)
    figures = {
        "row-add": figure("X and offsets: read one column at a time.",
                          "X আর offset: একবারে একটি কলাম দেখো।", {
            "tables": {
                "x": {"rows": 5, "cols": 2, "colLabels": ["Size", "Sweet"],
                      "cells": X.tolist()},
                "offsets": {"rows": 1, "cols": 2, "cells": [row.tolist()]},
                "result": {"rows": 5, "cols": 2, "cells": (X + row).tolist()},
            }}),
        "column-add": figure("One offset per fruit, shared by both feature columns.",
                             "প্রতি ফলের একটি offset দুই feature-এ যোগ হয়।", {
            "tables": {
                "x": {"rows": 5, "cols": 2, "cells": X.tolist()},
                "offsets": {"rows": 5, "cols": 1, "cells": col.tolist()},
                "result": {"rows": 5, "cols": 2, "cells": (X + col).tolist()},
            }}),
        "shape": figure("Five records, two measurements in each record.",
                        "পাঁচটি রেকর্ড, প্রতিটিতে দুটি মাপ।",
                        table("measurements", X.tolist(), ["Size", "Sweetness"])),
    }
    frame = pd.read_csv(ROOT / "shared/datasets/tiny_fruits.csv")
    groups = frame.groupby("label", sort=True)["size_cm"].agg(["count", "mean"])
    rows = [[str(label), int(values["count"]), round(float(values["mean"]), 1)]
            for label, values in groups.iterrows()]
    figures["groups"] = figure(
        "Size summaries of all ten shared fruit cards.",
        "শেয়ার করা দশটি ফলের আকারের সারাংশ।",
        table("groups", rows, ["Label", "Count", "Mean cm"]))
    sizes = np.array([2, 3, 4, 6, 7, 9])
    sweet = np.array([3, 2, 3, 7, 8, 1])
    labels = np.array([0, 0, 0, 1, 1, 1])
    figures["scatter"] = figure(
        "Six invented fruits; the rightmost mango is unlike the other mangoes.",
        "ছয়টি বানানো ফল; সবচেয়ে ডানের আমটি অন্য আমগুলোর চেয়ে আলাদা।", {
        "plot": {"xRange": [0, 10], "yRange": [0, 10], "xLabel": "Size (cm)",
                 "yLabel": "Sweetness (0-10)",
                 "classes": [{"id": 0, "label": "Apple"}, {"id": 1, "label": "Mango"}],
                 "points": [{"id": f"p{i+1}", "x": int(x), "y": int(y), "cls": int(c)}
                            for i, (x, y, c) in enumerate(zip(sizes, sweet, labels))]}})
    overs = np.arange(1, 7)
    runs = np.array([4, 7, 13, 15, 22, 30])
    figures["line"] = figure(
        "Team total after each of six ordered overs.", "ছয়টি over শেষে দলের মোট রান।", {
        "chart": {"xLabel": "Completed overs", "yLabel": "Cumulative runs",
                  "series": [{"id": "runs", "label": "Team total", "type": "line",
                              "points": np.column_stack([overs, runs]).tolist()}]}})
    counts, edges = np.histogram(sizes, bins=[0, 3, 6, 9])
    figures["histogram"] = figure(
        "Counts in equal-width size bins; the final bin includes 9.",
        "সমান চওড়া আকারের ঘরে সংখ্যা; শেষ ঘরে ৯-ও আছে।", {
        "chart": {"xLabel": "Size interval (cm)", "yLabel": "Fruit count",
                  "series": [{"id": "counts", "label": "Count", "type": "bar",
                              "points": [[name, int(value)] for name, value in
                                         zip(["[0,3)", "[3,6)", "[6,9]"], counts)]}]}})
    return figures


def main():
    figures = build()
    (ROOT / "shared/python-figures.json").write_text(
        json.dumps(figures, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    plot = figures["scatter"]["panels"]["plot"]
    fig, ax = plt.subplots(figsize=(6, 4))
    for cls, marker in [(0, "o"), (1, "^")]:
        pts = [p for p in plot["points"] if p["cls"] == cls]
        ax.scatter([p["x"] for p in pts], [p["y"] for p in pts],
                   marker=marker, label=plot["classes"][cls]["label"])
        for p in pts:
            ax.annotate(p["id"], (p["x"], p["y"]), xytext=(5, 5),
                        textcoords="offset points")
    ax.set(xlim=plot["xRange"], ylim=plot["yRange"], xlabel=plot["xLabel"],
           ylabel=plot["yLabel"], title="Six invented fruit cards")
    ax.legend()
    fig.tight_layout()
    destination = ROOT / "topics/python-for-ml/ml-python-practice-sheet/assets"
    destination.mkdir(parents=True, exist_ok=True)
    fig.savefig(destination / "worksheet-scatter.png", dpi=110)
    plt.close(fig)
    print(f"Computed {len(figures)} quiz figures and one matching worksheet scatter plot.")


if __name__ == "__main__":
    main()
