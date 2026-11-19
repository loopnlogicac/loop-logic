first = "Dormitory"
second = "Dirty room"
left = sorted(letter for letter in first.casefold() if letter.isalpha())
right = sorted(letter for letter in second.casefold() if letter.isalpha())
print(left == right)
print(sorted("aab") == sorted("abb"))
