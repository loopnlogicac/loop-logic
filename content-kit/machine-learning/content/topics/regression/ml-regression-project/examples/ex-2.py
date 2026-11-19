import math
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.dummy import DummyRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.preprocessing import OneHotEncoder, PolynomialFeatures, StandardScaler

NUMERIC = ["area_sqft", "rooms", "floor", "distance_km"]
FEATURES = NUMERIC + ["district"]


def make_model(degree):
    numeric = make_pipeline(SimpleImputer(strategy="median"), StandardScaler(),
                            PolynomialFeatures(degree, include_bias=False))
    category = make_pipeline(SimpleImputer(strategy="most_frequent"),
                             OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    prep = ColumnTransformer([("numbers", numeric, NUMERIC),
                              ("district", category, ["district"])])
    return Pipeline([("prepare", prep), ("regress", LinearRegression())])


def predict_flat(model, area_sqft, rooms, floor, distance_km, district):
    if area_sqft <= 0 or rooms < 1 or floor < 0 or distance_km < 0:
        raise ValueError("Flat measurements must be physically valid")
    row = pd.DataFrame([[area_sqft, rooms, floor, distance_km, district]], columns=FEATURES)
    return float(model.predict(row)[0])


def main():
    frame = pd.read_csv("rent.csv")
    # The unusual high rent remains: investigate it rather than deleting it by score.
    X_build, X_test, y_build, y_test = train_test_split(
        frame[FEATURES], frame["rent_bdt"], test_size=0.2, random_state=0)
    X_train, X_valid, y_train, y_valid = train_test_split(
        X_build, y_build, test_size=0.25, random_state=0)
    print(f"Rows: train={len(X_train)}, validation={len(X_valid)}, test={len(X_test)}")
    candidates = []
    for degree in [1, 2]:
        model = make_model(degree)
        model.fit(X_train, y_train)
        loss = mean_absolute_error(y_valid, model.predict(X_valid))
        print(f"Degree {degree} validation MAE: {loss:.3f} BDT")
        candidates.append((loss, degree))
    _, degree = min(candidates)
    chosen = make_model(degree).fit(X_build, y_build)
    baseline = DummyRegressor(strategy="mean").fit(X_build, y_build)
    print(f"Selected degree: {degree}; refit on {len(X_build)} development rows")
    for name, model in [("Mean baseline", baseline), ("Selected model", chosen)]:
        pred = model.predict(X_test)
        print(f"{name}: test MAE={mean_absolute_error(y_test, pred):.3f} BDT, "
              f"RMSE={math.sqrt(mean_squared_error(y_test, pred)):.3f} BDT")
    pred = predict_flat(chosen, 1000, 3, 2, 5, "Mirpur")
    print(f"Invented Mirpur flat estimate: {pred:.0f} BDT/month")


if __name__ == "__main__":
    main()
