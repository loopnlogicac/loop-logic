def main():
    points = [(1, 1), (1, 2), (2, 1), (4, 4), (4, 5), (5, 4)]
    labels = [0, 0, 0, 1, 1, 1]
    predicted = [int(x > 3) for x, _ in points]
    query = int(3.3 > 3)
    correct = sum(a == b for a, b in zip(labels, predicted))
    print(f"Query class: {query}")
    print(f"Training accuracy: {correct / len(labels):.3f}")


if __name__ == "__main__":
    main()
