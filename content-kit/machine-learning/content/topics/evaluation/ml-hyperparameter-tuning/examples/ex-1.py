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

def main():
    points = [(1, 1, 0), (1, 2, 0), (2, 1, 0), (4, 4, 1), (4, 5, 1), (5, 4, 1)]
    validation = [(1.2, 1.4, 0), (2.2, 2, 0), (4.2, 4.4, 1), (5, 5, 1)]
    selected_k = 3
    def accuracy(rows, k):
        return sum(classify(points, p[:2], k)[0] == p[2] for p in rows) / len(rows)
    results = [(k, accuracy(validation, k)) for k in range(1, 10)]
    training = accuracy(points, selected_k)
    score = accuracy(validation, selected_k)
    best_k, best_score = max(results, key=lambda row: (row[1], -row[0]))
    print(f"selectedK {selected_k}")
    print(f"trainingAccuracy {training:.3f}")
    print(f"validationAccuracy {score:.3f}")
    print(f"bestK {best_k}")
    print(f"bestAccuracy {best_score:.3f}")


if __name__ == "__main__":
    main()
