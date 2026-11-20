from sklearn.tree import DecisionTreeClassifier

def main():
    points = [(1, 1, 0), (1, 4, 0), (2, 2, 0), (2, 5, 1),
              (4, 1, 1), (4, 4, 1), (5, 2, 1), (5, 5, 1)]
    x, y = [p[:2] for p in points], [p[2] for p in points]
    model = DecisionTreeClassifier(max_depth=2, min_impurity_decrease=1e-12, random_state=0)
    model.fit(x, y)
    prediction = int(model.predict([[2, 5]])[0])
    correct = sum(int(a) == b for a, b in zip(model.predict(x), y))
    nodes = model.tree_.node_count
    print(f"prediction {prediction}")
    print(f"correct {correct}")
    print(f"nodes {nodes}")


if __name__ == "__main__":
    main()
