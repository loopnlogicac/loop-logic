import sys


def main():
    tokens = iter(sys.stdin.read().split())
    n = int(next(tokens))
    pairs = [(float(next(tokens)), float(next(tokens))) for _ in range(n)]
    import math
    errors = [y - prediction for y, prediction in pairs]
    mae = sum(abs(e) for e in errors) / n
    mse = sum(e * e for e in errors) / n
    mean = sum(y for y, _ in pairs) / n
    sst = sum((y - mean) ** 2 for y, _ in pairs)
    r2 = f"{1 - n*mse/sst:.3f}" if sst else "undefined"
    print(f"{mae:.3f} {mse:.3f} {math.sqrt(mse):.3f} {r2}")


if __name__ == "__main__":
    main()
