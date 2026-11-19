import numpy as np
import pandas as pd
import sklearn
import matplotlib

matplotlib.use("Agg")


def main():
    values = np.array([2, 4, 6])
    frame = pd.DataFrame({"size_cm": values})
    print(f"Fruit rows: {len(frame)}")
    print(f"Mean size: {values.mean():.1f} cm")
    print(f"scikit-learn config available: {isinstance(sklearn.get_config(), dict)}")
    print(f"Plot backend: {matplotlib.get_backend().lower()}")


if __name__ == "__main__":
    main()
