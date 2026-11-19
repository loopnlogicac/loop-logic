values = sorted(map(int, input().split()))
n = len(values)
median = values[n//2] if n%2 else (values[n//2-1]+values[n//2])/2
print(f"{median:.1f}")
