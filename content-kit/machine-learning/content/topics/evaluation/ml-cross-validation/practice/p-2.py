import math

def main():
    try:
        scores = list(map(float, input().split()))
        if not 2 <= len(scores) <= 5 or any(not 0 <= s <= 1 for s in scores):
            raise ValueError
    except (ValueError, EOFError):
        print("invalid")
        return
    mean = sum(scores) / len(scores)
    spread = math.sqrt(sum((s - mean) ** 2 for s in scores) / len(scores))
    print(f"{mean:.3f} {spread:.3f}")


if __name__ == "__main__":
    main()
