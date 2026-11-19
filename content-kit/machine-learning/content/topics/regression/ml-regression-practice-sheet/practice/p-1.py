import sys


def main():
    tokens = iter(sys.stdin.read().split())
    n = int(next(tokens))
    pairs = [(float(next(tokens)), float(next(tokens))) for _ in range(n)]
    x_mean = sum(x for x, _ in pairs) / n
    y_mean = sum(y for _, y in pairs) / n
    sxx = sum((x - x_mean) ** 2 for x, _ in pairs)
    sxy = sum((x - x_mean) * (y - y_mean) for x, y in pairs)
    w = sxy / sxx if sxx else 0.0
    b = y_mean - w * x_mean
    print(f"{w:.3f} {b:.3f}")


if __name__ == "__main__":
    main()
