def main():
    try:
        rate = float(input())
        n = int(input())
        if not (0 < rate <= 1 and 1 <= n <= 20):
            raise ValueError
        rows = []
        for _ in range(n):
            x, y, label = map(float, input().split())
            if not (-3 <= x <= 3 and -3 <= y <= 3 and label in (0, 1)):
                raise ValueError
            rows.append((x, y, label))
    except (ValueError, EOFError):
        print("invalid")
        return
    g1 = sum((0.5 - c) * x for x, _, c in rows) / n
    g2 = sum((0.5 - c) * y for _, y, c in rows) / n
    gb = sum(0.5 - c for _, _, c in rows) / n
    values = [-rate * g for g in (g1, g2, gb)]
    values = [0.0 if abs(v) < 0.0005 else v for v in values]
    print(" ".join(f"{v:.3f}" for v in values))


if __name__ == "__main__":
    main()
