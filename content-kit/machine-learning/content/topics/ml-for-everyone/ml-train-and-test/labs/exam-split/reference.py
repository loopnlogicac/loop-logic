"""Teacher reference for the ordered ten-card train/test demonstration."""
POINTS = [
    (1, 2, 0), (2, 3, 0), (3, 5, 1), (4, 4, 0), (6, 7, 1),
    (9, 8, 1), (2.7, 3, 0), (3.3, 4, 0), (5.5, 7, 1), (8, 8, 1),
]


def fit(points, test_count):
    train = points[:-test_count]
    sizes = sorted({p[0] for p in train})
    candidates = [0, 10] + [(a + b) / 2 for a, b in zip(sizes, sizes[1:])]
    threshold = min(candidates, key=lambda t: (
        sum(int(p[0] > t) != p[2] for p in train), -t))
    majority = int(sum(p[2] == 1 for p in train) > len(train) / 2)
    return train, threshold, majority


def predict(model, x, train, threshold, majority):
    if model == "flat":
        return majority
    if model == "simple":
        return int(x > threshold)
    return min(train, key=lambda p: abs(p[0] - x))[2]


def score(points, test_count):
    train, threshold, majority = fit(points, test_count)
    test = points[-test_count:]
    counts = {}
    for model in ["flat", "simple", "flexible"]:
        counts[model] = [sum(predict(model, p[0], train, threshold, majority) != p[2]
                             for p in cards) for cards in [train, test]]
    return threshold, counts


def main():
    threshold, counts = score(POINTS, 4)
    print(f"trainSize=6 testSize=4 threshold={threshold:g}")
    for model, (training, testing) in counts.items():
        print(f"{model}: trainMistakes={training} testMistakes={testing}")


if __name__ == "__main__":
    main()
