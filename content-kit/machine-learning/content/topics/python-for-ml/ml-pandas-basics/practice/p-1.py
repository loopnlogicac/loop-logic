import pandas as pd

frame = pd.DataFrame({"size_cm": [2, 3, 4, 6, 7],
                      "sweetness": [3, 2, 3, 7, 8]}, index=[10, 20, 30, 40, 50])
label = int(input())
row = frame.loc[label]
print(f"{row['size_cm']} {row['sweetness']}")
