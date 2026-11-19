import pandas as pd
frame = pd.read_csv("rent.csv")
print(f"Rows: {len(frame)}")
for column in ["area_sqft", "rooms", "floor", "distance_km", "district", "rent_bdt"]:
    print(f"Missing {column}: {frame[column].isna().sum()}")
print(f"Rent range: {frame['rent_bdt'].min():.0f} to {frame['rent_bdt'].max():.0f} BDT/month")
for district, count in frame["district"].value_counts().sort_index().items():
    print(f"{district}: {count}")
