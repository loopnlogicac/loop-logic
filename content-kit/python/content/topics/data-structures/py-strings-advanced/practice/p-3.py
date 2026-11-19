first = sorted(ch for ch in input().lower() if ch != " ")
second = sorted(ch for ch in input().lower() if ch != " ")
print("YES" if first == second else "NO")
