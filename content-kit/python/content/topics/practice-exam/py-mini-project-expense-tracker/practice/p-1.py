def main():
    count = int(input())
    totals = {}
    for _ in range(count):
        category, text = input().split()
        totals[category] = totals.get(category, 0) + int(text)
    if not totals:
        print("EMPTY")
    for category in sorted(totals):
        paisa = totals[category]
        print(category, f"{paisa // 100}.{paisa % 100:02d}")


if __name__ == "__main__":
    main()
