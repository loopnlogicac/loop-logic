from sklearn.neighbors import KNeighborsClassifier

def main():
    points = [(1, 1, 0), (1, 2, 0), (2, 1, 0), (4, 4, 1), (4, 5, 1), (5, 4, 1)]
    validation = [(1.2, 1.4, 0), (2.2, 2, 0), (4.2, 4.4, 1), (5, 5, 1)]
    weights = "uniform"
    selected_k = 3
    x = [p[:2] for p in points]
    y = [p[2] for p in points]
    vx = [p[:2] for p in validation]
    vy = [p[2] for p in validation]
    def score(k):
        model = KNeighborsClassifier(n_neighbors=min(k, len(points)), weights=weights)
        model.fit(x, y)
        return model.score(vx, vy)
    scores = [(k, score(k)) for k in (1, 3, 7, 15)]
    accuracy = score(selected_k)
    best_k, best_accuracy = max(scores, key=lambda row: (row[1], -row[0]))
    print(f"selectedK {selected_k}")
    print(f"accuracy {accuracy:.3f}")
    print(f"bestK {best_k}")
    print(f"bestAccuracy {best_accuracy:.3f}")


if __name__ == "__main__":
    main()
