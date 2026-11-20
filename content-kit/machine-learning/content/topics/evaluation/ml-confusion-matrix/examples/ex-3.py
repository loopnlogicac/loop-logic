from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import confusion_matrix

def main():
    data = load_iris()
    x_train, x_test, y_train, y_test = train_test_split(
        data.data, data.target, test_size=0.3, stratify=data.target, random_state=0
    )
    model = DecisionTreeClassifier(max_depth=3, random_state=0)
    model.fit(x_train, y_train)
    predicted = model.predict(x_test)
    matrix = confusion_matrix(y_test, predicted, labels=[0, 1, 2])
    print("Rows actual, columns predicted: setosa versicolor virginica")
    for row in matrix:
        print(" ".join(str(int(value)) for value in row))
    print(f"Test accuracy: {model.score(x_test, y_test):.3f}")


if __name__ == "__main__":
    main()
