import sys


def main():
    tokens = iter(sys.stdin.read().split())
    n = int(next(tokens))
    pairs = [(float(next(tokens)), float(next(tokens))) for _ in range(n)]
    print(" ".join(f"{a-b:.1f}" for a, b in pairs))


if __name__ == "__main__":
    main()
