from collections import Counter


def main():
    counts = Counter(input().split())
    for word in sorted(counts):
        print(word, counts[word])


if __name__ == "__main__":
    main()
