from collections import Counter, defaultdict


def main():
    counts = Counter("pen book pen".split())
    print(sorted(counts.items()))
    print(counts["ruler"])
    groups = defaultdict(list)
    for room, roll in [("A", 12), ("B", 18), ("A", 25)]:
        groups[room].append(roll)
    print(dict(groups))


if __name__ == "__main__":
    main()
