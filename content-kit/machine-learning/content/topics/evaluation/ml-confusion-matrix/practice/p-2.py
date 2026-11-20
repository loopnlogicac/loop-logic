def main():
    try:
        n = int(input())
        if not 1 <= n <= 30:
            raise ValueError
        rows = [tuple(map(int, input().split())) for _ in range(n)]
        if any(len(row) != 2 or any(v not in (0, 1, 2) for v in row) for row in rows):
            raise ValueError
    except (ValueError, EOFError):
        print("invalid")
        return
    matrix = [[0] * 3 for _ in range(3)]
    for actual, predicted in rows:
        matrix[actual][predicted] += 1
    for row in matrix:
        print(" ".join(map(str, row)))


if __name__ == "__main__":
    main()
