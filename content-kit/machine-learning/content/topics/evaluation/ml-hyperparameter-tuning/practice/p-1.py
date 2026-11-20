def main():
    try:
        n = int(input())
        if not 1 <= n <= 20:
            raise ValueError
        rows = []
        for _ in range(n):
            k_text, score_text = input().split()
            k, score = int(k_text), float(score_text)
            if not (1 <= k <= 100 and 0 <= score <= 1):
                raise ValueError
            rows.append((k, score))
        if len({k for k, _ in rows}) != n:
            raise ValueError
    except (ValueError, EOFError):
        print("invalid")
        return
    k, score = max(rows, key=lambda row: (row[1], -row[0]))
    print(f"{k} {score:.3f}")


if __name__ == "__main__":
    main()
