import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler

frame = pd.read_csv("study.csv")
frame = frame.loc[frame["hours_studied"].between(0, 24) | frame["hours_studied"].isna()]
X_build, X_test, y_build, y_test = train_test_split(
    frame[["hours_studied"]], frame["marks"], test_size=0.2, random_state=0)
X_train, X_valid, y_train, y_valid = train_test_split(
    X_build, y_build, test_size=0.25, random_state=0)
models = []
for degree in [1, 3, 12]:
    model = make_pipeline(SimpleImputer(strategy="median"), StandardScaler(),
                          PolynomialFeatures(degree, include_bias=False), LinearRegression())
    model.fit(X_train, y_train)
    loss = mean_squared_error(y_valid, model.predict(X_valid))
    models.append((loss, degree, model))
    print(f"Degree {degree}: validation MSE {loss:.3f}")
_, degree, model = min(models, key=lambda item: item[0])
print(f"Selected degree: {degree}")
print(f"Final test MSE: {mean_squared_error(y_test, model.predict(X_test)):.3f}")
