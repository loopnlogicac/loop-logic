import sys


def main():
    tokens = iter(sys.stdin.read().split())
    n = int(next(tokens))
    pairs = [(float(next(tokens)), float(next(tokens))) for _ in range(n)]
    w1, w2, b = (float(next(tokens)) for _ in range(3))
    costs = [sum((y-w*x-b)**2 for x,y in pairs)/n for w in [w1,w2]]
    print(" ".join(f"{v:.3f}" for v in costs))


if __name__ == "__main__":
    main()
