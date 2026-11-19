def broadcast_add(X, offsets, mode):
    result = []
    total = 0
    for r, row in enumerate(X):
        output_row = []
        for c, value in enumerate(row):
            offset = offsets[c] if mode == "row" else offsets[r]
            output_row.append(value + offset)
            total += output_row[-1]
        result.append(output_row)
    return result, total


def main():
    X = [[2, 3], [3, 2], [4, 3], [6, 7], [7, 8]]
    result, total = broadcast_add(X, [10, 20], "row")
    print(f"Result: {result}")
    print(f"Total: {total}")


if __name__ == "__main__":
    main()
