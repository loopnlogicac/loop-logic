import pandas as pd
from sklearn.model_selection import train_test_split, KFold, learning_curve
from sklearn.pipeline import make_pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error

def main():
    data = pd.read_csv("study.csv")
    features = ["hours_studied", "attendance_pct", "past_marks", "sleep_hours"]
    x_dev, x_test, y_dev, y_test = train_test_split(
        data[features], data["marks"], test_size=0.2, random_state=0
    )
    model = make_pipeline(SimpleImputer(strategy="median"), StandardScaler(), Ridge(alpha=1))
    cv = KFold(n_splits=5, shuffle=True, random_state=0)
    sizes, training, validation = learning_curve(
        model, x_dev, y_dev, cv=cv, train_sizes=[0.25, 0.5, 1.0],
        scoring="neg_mean_squared_error", shuffle=True, random_state=0
    )
    for n, train, val in zip(sizes, -training.mean(axis=1), -validation.mean(axis=1)):
        print(f"Training rows {n}: train MSE {train:.3f}; validation MSE {val:.3f}")
    model.fit(x_dev, y_dev)
    print(f"Reserved test MSE: {mean_squared_error(y_test, model.predict(x_test)):.3f}")


if __name__ == "__main__":
    main()
