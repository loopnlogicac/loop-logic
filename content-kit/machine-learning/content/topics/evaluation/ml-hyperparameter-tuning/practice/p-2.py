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
        n, m = map(int, input().split())
        if not (2 <= n <= 20 and 1 <= m <= 10):
            raise ValueError
        all_rows = []
        for _ in range(n + m):
            x, y, label = map(float, input().split())
            if not (0 <= x <= 6 and 0 <= y <= 6 and label in (0, 1)):
                raise ValueError
            all_rows.append((x, y, int(label)))
    except (ValueError, EOFError):
        print("invalid")
        return
    points, validation = all_rows[:n], all_rows[n:]
    results = []
    for k in (1, 3, 7):
        for weights in ("uniform", "distance"):
            correct = sum(classify(points, p[:2], k, weights)[0] == p[2] for p in validation)
            results.append((correct / m, -k, weights == "uniform", k, weights))
    score, _, _, k, weights = max(results)
    print(f"{k} {weights} {score:.3f}")


if __name__ == "__main__":
    main()
