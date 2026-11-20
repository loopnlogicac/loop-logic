import math


def neighbours(points, query, k):
    ranked = sorted(enumerate(points), key=lambda item: (
        (item[1][0] - query[0]) ** 2 + (item[1][1] - query[1]) ** 2, item[0]
    ))
    return [point for _, point in ranked[:min(k, len(points))]]


def classify(points, query, k, weights="uniform"):
    selected = neighbours(points, query, k)
    distances = [math.hypot(p[0] - query[0], p[1] - query[1]) for p in selected]
    votes = [0.0, 0.0]
    if weights == "distance" and any(d == 0 for d in distances):
        for point, distance in zip(selected, distances):
            if distance == 0:
                votes[point[2]] += 1
    else:
        for point, distance in zip(selected, distances):
            votes[point[2]] += 1 if weights == "uniform" else 1 / distance
    return int(votes[1] > votes[0]), votes


CV_POINTS = [(1, 1, 0), (1, 2, 0), (2, 1, 0), (2, 2, 0), (4, 4, 0),
             (4, 5, 1), (5, 4, 1), (5, 5, 1), (4, 4.6, 1), (3, 4, 1)]


def stratified_folds(points, requested):
    groups = [[i for i, p in enumerate(points) if p[2] == label] for label in (0, 1)]
    if min(map(len, groups)) < 2:
        return None
    count = min(requested, min(map(len, groups)))
    folds = [[] for _ in range(count)]
    for group in groups:
        for position, index in enumerate(group):
            folds[position % count].append(index)
    return folds


def fold_scores(points, requested=5, neighbours_count=1):
    folds = stratified_folds(points, requested)
    if folds is None:
        return None
    scores = []
    for held_out in folds:
        train = [p for i, p in enumerate(points) if i not in held_out]
        correct = sum(classify(train, points[i][:2], neighbours_count)[0] == points[i][2]
                      for i in held_out)
        scores.append(correct / len(held_out))
    return scores

def main():
    scores = fold_scores(CV_POINTS, requested=5, neighbours_count=1)
    mean = sum(scores) / len(scores)
    spread = math.sqrt(sum((s - mean) ** 2 for s in scores) / len(scores))
    print("status finished")
    print(f"folds {len(scores)}")
    print(f"mean {mean:.3f}")
    print(f"spread {spread:.3f}")
    print("foldScores " + ",".join(f"{s:.2f}" for s in scores))


if __name__ == "__main__":
    main()
