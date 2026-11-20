from sklearn.tree import DecisionTreeClassifier

def main():
    points = [[1, 1], [1, 2], [2, 1], [4, 4], [4, 5], [5, 4]]
    labels = [0, 0, 0, 1, 1, 1]
    model = DecisionTreeClassifier(max_depth=1, random_state=0)
    model.fit(points, labels)
    query = int(model.predict([[3.3, 3.3]])[0])
    print(f"Query class: {query}")
    print(f"Training accuracy: {model.score(points, labels):.3f}")


if __name__ == "__main__":
    main()
