import sys


def main():
    tokens = iter(sys.stdin.read().split())
    n = int(next(tokens))
    pairs = [(float(next(tokens)), float(next(tokens))) for _ in range(n)]
    w, b, lr = (float(next(tokens)) for _ in range(3))
    grad_w = 2 * sum((w*x+b-y)*x for x,y in pairs) / n
    grad_b = 2 * sum(w*x+b-y for x,y in pairs) / n
    print(f"{w-lr*grad_w:.3f} {b-lr*grad_b:.3f}")


if __name__ == "__main__":
    main()
