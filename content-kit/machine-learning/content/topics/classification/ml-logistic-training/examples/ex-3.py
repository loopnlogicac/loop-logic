from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import log_loss

def main():
    data = load_breast_cancer()
    x_train, x_test, y_train, y_test = train_test_split(
        data.data, data.target, test_size=0.25, stratify=data.target, random_state=0
    )
    model = make_pipeline(StandardScaler(), LogisticRegression(C=1, max_iter=2000, random_state=0))
    model.fit(x_train, y_train)
    probabilities = model.predict_proba(x_test)
    print(f"Test accuracy: {model.score(x_test, y_test):.3f}")
    print(f"Test log loss: {log_loss(y_test, probabilities):.3f}")


if __name__ == "__main__":
    main()
