def main():
    try:
        requested = int(input())
        n = int(input())
        labels = list(map(int, input().split()))
        if not (2 <= requested <= 5 and 4 <= n <= 20 and len(labels) == n):
            raise ValueError
        if any(label not in (0, 1) for label in labels):
            raise ValueError
    except (ValueError, EOFError):
        print("invalid")
        return
    counts = [labels.count(0), labels.count(1)]
    if min(counts) < 2:
        print("insufficient")
        return
    folds = min(requested, min(counts))
    positions = [0, 0]
    assigned = []
    for label in labels:
        assigned.append(positions[label] % folds + 1)
        positions[label] += 1
    print(folds)
    print(" ".join(map(str, assigned)))


if __name__ == "__main__":
    main()
