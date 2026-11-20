from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier

def main():
    data = load_iris()
    x_dev, x_test, y_dev, y_test = train_test_split(
        data.data, data.target, test_size=0.2, stratify=data.target, random_state=0
    )
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
    model = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=3))
    scores = cross_val_score(model, x_dev, y_dev, cv=cv)
    print(f"CV mean: {scores.mean():.3f}")
    print(f"CV population spread: {scores.std():.3f}")
    model.fit(x_dev, y_dev)
    print(f"Reserved final test: {model.score(x_test, y_test):.3f}")


if __name__ == "__main__":
    main()
