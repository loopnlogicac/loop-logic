def main():
    try:
        n = int(input())
        if not 2 <= n <= 5:
            raise ValueError
        rows = [list(map(float, input().split())) for _ in range(n)]
        if any(len(r) != 3 or any(not -100 <= v <= 100 for v in r) for r in rows):
            raise ValueError
    except (ValueError, EOFError):
        print("invalid")
        return
    variances = []
    for row in rows:
        mean = sum(row) / 3
        variances.append(sum((v - mean) ** 2 for v in row) / 3)
    print(f"{sum(variances) / n:.3f}")


if __name__ == "__main__":
    main()
