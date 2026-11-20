from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

def main():
    data = load_iris()
    x_train, x_test, y_train, y_test = train_test_split(
        data.data, data.target, test_size=0.3, stratify=data.target, random_state=0
    )
    for criterion in ("gini", "entropy"):
        model = DecisionTreeClassifier(criterion=criterion, max_depth=3, random_state=0)
        model.fit(x_train, y_train)
        print(f"{criterion} test accuracy: {model.score(x_test, y_test):.3f}")


if __name__ == "__main__":
    main()
