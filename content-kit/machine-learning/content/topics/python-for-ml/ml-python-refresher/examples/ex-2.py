sizes = [2, 3, 4, 5, 6]
large = [size for size in sizes if size >= 4]
millimetres = [size * 10 for size in large]
print(f"Selected cm: {large}")
print(f"Selected mm: {millimetres}")
