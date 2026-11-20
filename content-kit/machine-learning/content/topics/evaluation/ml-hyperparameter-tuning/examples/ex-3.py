from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier

def main():
    data = load_iris()
    x_dev, x_test, y_dev, y_test = train_test_split(
        data.data, data.target, test_size=0.2, stratify=data.target, random_state=0
    )
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
    model = make_pipeline(StandardScaler(), KNeighborsClassifier())
    grid = {"kneighborsclassifier__n_neighbors": [1, 3, 5, 7],
            "kneighborsclassifier__weights": ["uniform", "distance"]}
    search = GridSearchCV(model, grid, cv=cv, scoring="accuracy", refit=True)
    search.fit(x_dev, y_dev)
    print(f"Chosen k: {search.best_params_['kneighborsclassifier__n_neighbors']}")
    print(f"Chosen weights: {search.best_params_['kneighborsclassifier__weights']}")
    print(f"Best development CV: {search.best_score_:.3f}")
    print(f"Reserved final test: {search.score(x_test, y_test):.3f}")


if __name__ == "__main__":
    main()
