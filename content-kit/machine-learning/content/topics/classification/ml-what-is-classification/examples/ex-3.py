from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

def main():
    iris = load_iris()
    x_train, x_test, y_train, y_test = train_test_split(
        iris.data, iris.target, test_size=0.3, stratify=iris.target, random_state=0
    )
    model = DecisionTreeClassifier(max_depth=3, random_state=0)
    model.fit(x_train, y_train)
    print(f"Classes: {len(model.classes_)}")
    print(f"Test flowers: {len(y_test)}")
    print(f"Test accuracy: {model.score(x_test, y_test):.3f}")


if __name__ == "__main__":
    main()
