from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split, StratifiedKFold, RandomizedSearchCV
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier

def main():
    data = load_iris()
    x_dev, _, y_dev, _ = train_test_split(
        data.data, data.target, test_size=0.2, stratify=data.target, random_state=0
    )
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
    model = make_pipeline(StandardScaler(), KNeighborsClassifier())
    space = {"kneighborsclassifier__n_neighbors": [1, 3, 5, 7, 9, 11],
             "kneighborsclassifier__weights": ["uniform", "distance"]}
    search = RandomizedSearchCV(model, space, n_iter=4, cv=cv, scoring="accuracy",
                                random_state=0, refit=True)
    search.fit(x_dev, y_dev)
    print(f"Sampled candidates: {len(search.cv_results_['params'])}")
    print(f"Chosen k: {search.best_params_['kneighborsclassifier__n_neighbors']}")
    print(f"Development CV: {search.best_score_:.3f}")


if __name__ == "__main__":
    main()
