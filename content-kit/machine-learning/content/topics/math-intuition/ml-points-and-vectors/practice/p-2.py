values = list(map(int, input().split()))
scale = int(input())
print(*(scale*v for v in values))
