text = "Never odd or even"
cleaned = "".join(letter for letter in text.casefold() if letter.isalnum())
print(cleaned)
print(cleaned == cleaned[::-1])
