import numpy as np

sizes_list = [2, 3, 4, 5, 6]
sizes = np.array(sizes_list, dtype=np.float64)
print(f"List doubled: {sizes_list * 2}")
print(f"Array doubled: {(sizes * 2).tolist()}")
print(f"shape={sizes.shape}, ndim={sizes.ndim}, dtype={sizes.dtype}")
