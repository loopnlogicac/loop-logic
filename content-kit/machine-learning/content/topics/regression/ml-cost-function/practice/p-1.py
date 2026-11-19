import sys


def main():
    tokens = iter(sys.stdin.read().split())
    n = int(next(tokens))
    pairs = [(float(next(tokens)), float(next(tokens))) for _ in range(n)]
    print(f"{sum((a-b)**2 for a,b in pairs)/n:.3f}")


if __name__ == "__main__":
    main()
