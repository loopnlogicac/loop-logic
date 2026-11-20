from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

def main():
    data = load_breast_cancer()
    x_train, x_test, y_train, y_test = train_test_split(
        data.data, data.target, test_size=0.25, stratify=data.target, random_state=0
    )
    model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000, random_state=0))
    model.fit(x_train, y_train)
    probability = model.predict_proba(x_test)[:, 1]
    print(f"Class-one name: {data.target_names[1]}")
    print(f"First class-one probability: {probability[0]:.3f}")
    print(f"Test accuracy: {model.score(x_test, y_test):.3f}")


if __name__ == "__main__":
    main()
