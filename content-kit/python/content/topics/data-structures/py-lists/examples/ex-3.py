original = [10, 20]
alias = original
separate = original.copy()
alias.append(30)
separate[0] = 99
print(original)
print(separate)
print(alias is original, separate is original)
