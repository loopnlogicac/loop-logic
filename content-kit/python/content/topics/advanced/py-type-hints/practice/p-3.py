def count(words: list[str]) -> dict[str, int]:
    result: dict[str, int] = {}
    for word in words:
        result[word] = result.get(word, 0) + 1
    return result


def main() -> None:
    counts = count(input().split())
    if not counts:
        print("EMPTY")
    for word in sorted(counts):
        print(word, counts[word])


if __name__ == "__main__":
    main()
