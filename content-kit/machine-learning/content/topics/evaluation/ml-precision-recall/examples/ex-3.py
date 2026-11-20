from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.dummy import DummyClassifier
from sklearn.metrics import accuracy_score, recall_score, classification_report

def main():
    data = load_breast_cancer()
    x_train, x_test, y_train, y_test = train_test_split(
        data.data, data.target, test_size=0.25, stratify=data.target, random_state=0
    )
    models = [("Majority", DummyClassifier(strategy="most_frequent", random_state=0)),
              ("Logistic", make_pipeline(StandardScaler(),
                                        LogisticRegression(max_iter=2000, random_state=0)))]
    for name, model in models:
        model.fit(x_train, y_train)
        predicted = model.predict(x_test)
        recall = recall_score(y_test, predicted, pos_label=0, zero_division=0)
        print(
            f"{name}: accuracy {accuracy_score(y_test, predicted):.3f}; "
            f"malignant recall {recall:.3f}"
        )
    report = classification_report(y_test, predicted, labels=[0, 1],
                                   target_names=list(data.target_names),
                                   output_dict=True, zero_division=0)
    for name in data.target_names:
        row = report[name]
        print(
            f"{name}: precision {row['precision']:.3f}; "
            f"recall {row['recall']:.3f}; "
            f"F1 {row['f1-score']:.3f}"
        )


if __name__ == "__main__":
    main()
