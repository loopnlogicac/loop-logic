def confusion(rows, threshold=0.5):
    counts = {"tn": 0, "fp": 0, "fn": 0, "tp": 0}
    for score, label in rows:
        predicted = int(score >= threshold)
        key = (("tn", "fp"), ("fn", "tp"))[label][predicted]
        counts[key] += 1
    return counts


def binary_metrics(counts):
    tn, fp, fn, tp = (counts[k] for k in ("tn", "fp", "fn", "tp"))
    total = tn + fp + fn + tp
    precision = tp / (tp + fp) if tp + fp else 0.0
    recall = tp / (tp + fn) if tp + fn else 0.0
    f1 = 2 * tp / (2 * tp + fp + fn) if 2 * tp + fp + fn else 0.0
    return {"accuracy": (tn + tp) / total if total else 0.0,
            "precision": precision, "recall": recall, "f1": f1}


def roc_points(rows):
    positives = sum(label == 1 for _, label in rows)
    negatives = len(rows) - positives
    if not positives or not negatives:
        return None
    curve = [(0.0, 0.0, float("inf"))]
    for threshold in sorted({score for score, _ in rows}, reverse=True):
        counts = confusion(rows, threshold)
        curve.append((counts["fp"] / negatives, counts["tp"] / positives, threshold))
    return curve


def auc(rows):
    curve = roc_points(rows)
    if curve is None:
        return None
    return sum((right[0] - left[0]) * (right[1] + left[1]) / 2
               for left, right in zip(curve, curve[1:]))


SCORED_ROWS = [(0.1, 0), (0.3, 0), (0.45, 1), (0.6, 0), (0.8, 1), (0.9, 1)]

def main():
    try:
        threshold = float(input())
        n = int(input())
        if not (0 <= threshold <= 1 and 1 <= n <= 30):
            raise ValueError
        rows = []
        for _ in range(n):
            score, label = map(float, input().split())
            if not (0 <= score <= 1 and label in (0, 1)):
                raise ValueError
            rows.append((score, int(label)))
    except (ValueError, EOFError):
        print("invalid")
        return
    counts = confusion(rows, threshold)
    for key in ("tn", "fp", "fn", "tp"):
        print(f"{key} {counts[key]}")


if __name__ == "__main__":
    main()
