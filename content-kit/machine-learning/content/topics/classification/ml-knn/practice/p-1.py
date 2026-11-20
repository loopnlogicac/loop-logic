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
    try:
        n = int(input())
        if not 1 <= n <= 30:
            raise ValueError
        points = []
        for _ in range(n):
            x, y, label = map(float, input().split())
            if not (0 <= x <= 6 and 0 <= y <= 6 and label in (0, 1)):
                raise ValueError
            points.append((x, y, int(label)))
        qx, qy, raw_k = map(float, input().split())
        if not (0 <= qx <= 6 and 0 <= qy <= 6 and 1 <= raw_k <= 9 and raw_k.is_integer()):
            raise ValueError
        k = min(int(raw_k), n)
    except (ValueError, EOFError):
        print("invalid")
        return
    prediction, votes = classify(points, (qx, qy), k)
    print(f"prediction {prediction}")
    print(f"votes0 {int(votes[0])}")
    print(f"votes1 {int(votes[1])}")
    print(f"k {k}")


if __name__ == "__main__":
    main()
