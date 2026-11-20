def main():
    try:
        n = int(input())
        if not 1 <= n <= 20:
            raise ValueError
        rows = []
        for _ in range(n):
            x, y, label = map(float, input().split())
            if not (0 <= x <= 6 and 0 <= y <= 6 and label in (0, 1)):
                raise ValueError
            rows.append((x, y, int(label)))
    except (ValueError, EOFError):
        print("invalid")
        return
    correct = 0
    for x, y, label in rows:
        predicted = int(x > 3 or y > 4.5)
        correct += predicted == label
    print(f"correct {correct} of {n}")


if __name__ == "__main__":
    main()
