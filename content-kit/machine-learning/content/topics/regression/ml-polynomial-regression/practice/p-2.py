import sys


def main():
    tokens = iter(sys.stdin.read().split())
    n = int(next(tokens))
    pairs = [(float(next(tokens)), float(next(tokens))) for _ in range(n)]
    loss, degree = min((loss, int(degree)) for degree, loss in pairs)
    print(degree)


if __name__ == "__main__":
    main()
