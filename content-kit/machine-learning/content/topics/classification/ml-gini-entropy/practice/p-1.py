import math

def main():
    try:
        a, b = map(int, input().split())
        if not (0 <= a <= 100 and 0 <= b <= 100):
            raise ValueError
    except (ValueError, EOFError):
        print("invalid")
        return
    if a + b == 0:
        print("empty")
        return
    proportions = [a / (a + b), b / (a + b)]
    gini = 1 - sum(p * p for p in proportions)
    entropy = max(0.0, -sum(p * math.log2(p) for p in proportions if p > 0))
    print(f"{gini:.3f} {entropy:.3f}")


if __name__ == "__main__":
    main()
