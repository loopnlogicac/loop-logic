import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
rent = pd.read_csv("rent.csv")
train, test = train_test_split(rent[["district"]], test_size=0.2, random_state=0)
train = train.fillna("Missing")
test = test.fillna("Missing")
encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=False).fit(train)
print(f"Training columns: {len(encoder.categories_[0])}")
print(f"Test shape: {encoder.transform(test).shape}")
dummies = pd.get_dummies(train["district"], dtype=int)
print(f"get_dummies columns: {len(dummies.columns)}")
