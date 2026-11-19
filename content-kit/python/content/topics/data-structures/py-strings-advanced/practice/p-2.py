text = input().lower()
cleaned = "".join(ch for ch in text if "a" <= ch <= "z" or "0" <= ch <= "9")
print("YES" if cleaned == cleaned[::-1] else "NO")
