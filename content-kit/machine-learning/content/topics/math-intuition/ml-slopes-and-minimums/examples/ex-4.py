def cost(x):
    return (x - 1) ** 2


def main():
    x = 4.0
    for h in [1.0, 0.1, 0.01]:
        forward = (cost(x+h) - cost(x)) / h
        central = (cost(x+h) - cost(x-h)) / (2*h)
        print(f"h={h:.2f}: forward={forward:.3f} central={central:.3f}")


if __name__ == "__main__":
    main()
