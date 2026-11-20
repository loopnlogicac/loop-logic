from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

def main():
    data = load_breast_cancer()
    malignant = (data.target == 0).astype(int)
    x_train, x_test, y_train, y_test = train_test_split(
        data.data, malignant, test_size=0.25, stratify=malignant, random_state=0
    )
    model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000, random_state=0))
    model.fit(x_train, y_train)
    column = list(model.classes_).index(1)
    scores = model.predict_proba(x_test)[:, column]
    print("Positive class: malignant")
    print(f"Test ROC AUC: {roc_auc_score(y_test, scores):.3f}")


if __name__ == "__main__":
    main()
