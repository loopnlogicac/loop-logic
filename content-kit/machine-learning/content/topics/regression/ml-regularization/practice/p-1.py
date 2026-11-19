import sys


def main():
    tokens = iter(sys.stdin.read().split())
    n = int(next(tokens))
    pairs = [(float(next(tokens)), float(next(tokens))) for _ in range(n)]
    alpha = float(next(tokens))
    w = sum(x*y for x,y in pairs)/(sum(x*x for x,_ in pairs)+alpha)
    print(f"{w:.3f}")


if __name__ == "__main__":
    main()
