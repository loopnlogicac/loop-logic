def main():
    try:
        n = int(input())
        if not 1 <= n <= 20:
            raise ValueError
        rows = [tuple(map(int, input().split())) for _ in range(n)]
        if any(len(row) != 2 or any(v not in (0, 1) for v in row) for row in rows):
            raise ValueError
    except (ValueError, EOFError):
        print("invalid")
        return
    correct = sum(a == b for a, b in rows)
    print(f"correct {correct}")
    print(f"accuracy {correct / n:.3f}")


if __name__ == "__main__":
    main()
