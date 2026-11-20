def main():
    try:
        goal_text, n_text = input().split()
        goal, n = float(goal_text), int(n_text)
        if not (0 <= goal <= 1 and 1 <= n <= 20):
            raise ValueError
        rows = []
        totals = set()
        for _ in range(n):
            threshold_text, tp_text, fp_text, fn_text = input().split()
            threshold = float(threshold_text)
            tp, fp, fn = map(int, (tp_text, fp_text, fn_text))
            if not (0 <= threshold <= 1 and all(0 <= v <= 100 for v in (tp, fp, fn))):
                raise ValueError
            if tp + fn == 0:
                raise ValueError
            totals.add(tp + fn)
            precision = tp / (tp + fp) if tp + fp else 0.0
            recall = tp / (tp + fn)
            rows.append((precision, recall, threshold))
        if len(totals) != 1 or len({r[2] for r in rows}) != n:
            raise ValueError
    except (ValueError, EOFError):
        print("invalid")
        return
    eligible = [row for row in rows if row[1] >= goal]
    if not eligible:
        print("none")
        return
    precision, recall, threshold = max(eligible)
    print(f"{threshold:.3f} {precision:.3f} {recall:.3f}")


if __name__ == "__main__":
    main()
