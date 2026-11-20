from sklearn.linear_model import LogisticRegression

def main():
    points = [(-2, -1, 0), (-1, -2, 0), (-1, -1, 0), (1, 1, 1), (1, 2, 1), (2, 1, 1)]
    x = [p[:2] for p in points]
    y = [p[2] for p in points]
    model = LogisticRegression(C=1, tol=1e-12, max_iter=1000, random_state=0)
    model.fit(x, y)
    probabilities = model.predict_proba(x)[:, 1]
    predictions = [int(p >= 0.5) for p in probabilities]
    print("predictions " + ",".join(map(str, predictions)))
    print(f"positiveCount {sum(predictions)}")


if __name__ == "__main__":
    main()
