from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier

def main():
    iris = load_iris()
    x_dev, x_test, y_dev, y_test = train_test_split(
        iris.data, iris.target, test_size=0.2, stratify=iris.target, random_state=0
    )
    x_train, x_val, y_train, y_val = train_test_split(
        x_dev, y_dev, test_size=0.25, stratify=y_dev, random_state=0
    )
    scores = []
    for k in (1, 3, 7, 15):
        model = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=k))
        model.fit(x_train, y_train)
        scores.append((k, model.score(x_val, y_val)))
    best_k, _ = max(scores, key=lambda row: (row[1], -row[0]))
    model = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=best_k))
    model.fit(x_dev, y_dev)
    print(f"Chosen k: {best_k}")
    print(f"Final test accuracy: {model.score(x_test, y_test):.3f}")


if __name__ == "__main__":
    main()
