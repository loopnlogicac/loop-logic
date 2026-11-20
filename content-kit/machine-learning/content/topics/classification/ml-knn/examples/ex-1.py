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
    query = (3.3, 3.3)
    k = 3
    prediction, votes = classify(points, query, k)
    print(f"prediction {prediction}")
    print(f"votes0 {int(votes[0])}")
    print(f"votes1 {int(votes[1])}")
    print(f"k {k}")


if __name__ == "__main__":
    main()
