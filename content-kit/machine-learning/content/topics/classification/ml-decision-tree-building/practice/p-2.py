def main():
    try:
        total, n = map(int, input().split())
        if not (1 <= total <= 100 and 1 <= n <= 100):
            raise ValueError
        rows = []
        for index in range(n):
            leaves, mistakes = map(int, input().split())
            if not (1 <= leaves <= 1000 and 0 <= mistakes <= total):
                raise ValueError
            rows.append((mistakes, leaves, index + 1))
    except (ValueError, EOFError):
        print("invalid")
        return
    mistakes, _, index = min(rows)
    print(f"{index} {1 - mistakes / total:.3f}")


if __name__ == "__main__":
    main()
