from sklearn.preprocessing import OneHotEncoder
districts = [[v] for v in ["Badda", "Mirpur", "Uttara", "Badda", "Mirpur", "Uttara"]]
encoder = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
rows = encoder.fit_transform(districts)
print(f"Columns: {', '.join(encoder.categories_[0])}")
print(f"Rows: {len(rows)}")
print(f"Ones: {int(rows.sum())}")
print(f"First: {rows[0].astype(int).tolist()}")
