days = list(map(int, input().split()))
print(sum(day <= 0 for day in days))
