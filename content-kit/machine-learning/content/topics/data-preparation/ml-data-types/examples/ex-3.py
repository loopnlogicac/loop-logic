import pandas as pd
rent = pd.read_csv("rent.csv")
print(f"Rows: {len(rent)}")
print(f"Rooms dtype: {rent['rooms'].dtype}")
print(f"Area dtype: {rent['area_sqft'].dtype}")
print(f"Districts: {rent['district'].nunique()}")
print(f"Missing districts: {rent['district'].isna().sum()}")
