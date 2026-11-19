def total(values: list[int]) -> int:
    return sum(values)

def count_words(words: list[str]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts


def main() -> None:
    print(total([40, 75]))
    print(count_words(["lab", "class", "lab"]))


if __name__ == "__main__":
    main()
