first = set(int(token) for token in input().split())
second = set(int(token) for token in input().split())
print(*sorted(first & second))
