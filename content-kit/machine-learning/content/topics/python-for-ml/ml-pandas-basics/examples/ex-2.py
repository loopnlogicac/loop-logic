import pandas as pd

frame = pd.DataFrame({"size_cm": [2.0, 3.0, 4.0, 6.0, 7.0],
                      "sweetness": [3, 2, 3, 7, 8]})
# The report is useful locally; keep the saved output independent of memory estimates.
with open("info.txt", "w", encoding="utf-8") as handle:
    frame.info(buf=handle, memory_usage=False)
print("Wrote info.txt with column types and non-null counts.")
print(frame.describe().loc[["count", "mean", "min", "max"]].to_string(float_format="%.1f"))
