known = ["Badda", "Mirpur", "Uttara"]
names = input().split()
for name in names:
    print(" ".join(str(int(name == c)) for c in known))
print(f"Unknown: {sum(name not in known for name in names)}")
