from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

def main():
    data = load_iris()
    x_dev, x_test, y_dev, y_test = train_test_split(
        data.data, data.target, test_size=0.2, stratify=data.target, random_state=0
    )
    x_train, x_val, y_train, y_val = train_test_split(
        x_dev, y_dev, test_size=0.25, stratify=y_dev, random_state=0
    )
    results = []
    for depth in (1, 2, 3, 5, 8):
        model = DecisionTreeClassifier(max_depth=depth, random_state=0)
        model.fit(x_train, y_train)
        score = model.score(x_val, y_val)
        results.append((depth, score))
        print(f"Depth {depth}: train {model.score(x_train, y_train):.3f}; validation {score:.3f}")
    best_depth, _ = max(results, key=lambda row: (row[1], -row[0]))
    model = DecisionTreeClassifier(max_depth=best_depth, random_state=0)
    model.fit(x_dev, y_dev)
    print(f"Chosen depth: {best_depth}")
    print(f"Final test accuracy: {model.score(x_test, y_test):.3f}")


if __name__ == "__main__":
    main()
