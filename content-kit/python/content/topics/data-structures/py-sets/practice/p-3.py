registered = set(int(token) for token in input().split())
submitted = set(int(token) for token in input().split())
print(*sorted(registered - submitted))
