from sklearn.neighbors import KNeighborsClassifier

def main():
    points = [(1, 1, 0), (1, 2, 0), (2, 1, 0), (4, 4, 1), (4, 5, 1), (5, 4, 1)]
    validation = [(1.2, 1.4, 0), (2.2, 2, 0), (4.2, 4.4, 1), (5, 5, 1)]
    selected_k = 3
    x, y = [p[:2] for p in points], [p[2] for p in points]
    vx, vy = [p[:2] for p in validation], [p[2] for p in validation]
    results = []
    for k in range(1, 10):
        model = KNeighborsClassifier(n_neighbors=min(k, len(points)))
        model.fit(x, y)
        results.append((k, model.score(vx, vy)))
    model = KNeighborsClassifier(n_neighbors=selected_k).fit(x, y)
    training, score = model.score(x, y), model.score(vx, vy)
    best_k, best_score = max(results, key=lambda row: (row[1], -row[0]))
    print(f"selectedK {selected_k}")
    print(f"trainingAccuracy {training:.3f}")
    print(f"validationAccuracy {score:.3f}")
    print(f"bestK {best_k}")
    print(f"bestAccuracy {best_score:.3f}")


if __name__ == "__main__":
    main()
