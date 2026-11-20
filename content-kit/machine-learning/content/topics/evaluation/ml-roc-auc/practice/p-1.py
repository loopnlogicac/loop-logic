def main():
    try:
        n = int(input())
        if not 2 <= n <= 30:
            raise ValueError
        rows = []
        for _ in range(n):
            score, label = map(float, input().split())
            if not (0 <= score <= 1 and label in (0, 1)):
                raise ValueError
            rows.append((score, int(label)))
    except (ValueError, EOFError):
        print("invalid")
        return
    positive = [s for s, c in rows if c == 1]
    negative = [s for s, c in rows if c == 0]
    if not positive or not negative:
        print("undefined")
        return
    credit = sum(1 if p > q else 0.5 if p == q else 0
                 for p in positive for q in negative)
    print(f"{credit / (len(positive) * len(negative)):.3f}")


if __name__ == "__main__":
    main()
