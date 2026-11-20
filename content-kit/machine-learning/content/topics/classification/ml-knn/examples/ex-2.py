from sklearn.neighbors import KNeighborsClassifier

def main():
    points = [(1, 1, 0), (1, 2, 0), (2, 1, 0), (4, 4, 1), (4, 5, 1), (5, 4, 1)]
    query = (3.3, 3.3)
    k = 3
    x = [p[:2] for p in points]
    y = [p[2] for p in points]
    model = KNeighborsClassifier(n_neighbors=k, algorithm="brute")
    model.fit(x, y)
    prediction = int(model.predict([query])[0])
    selected = model.kneighbors([query], return_distance=False)[0]
    votes = [sum(y[i] == cls for i in selected) for cls in (0, 1)]
    print(f"prediction {prediction}")
    print(f"votes0 {int(votes[0])}")
    print(f"votes1 {int(votes[1])}")
    print(f"k {k}")


if __name__ == "__main__":
    main()
