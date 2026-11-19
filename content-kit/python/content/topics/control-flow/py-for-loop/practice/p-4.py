text = input()
for character in text:
    if character in "0123456789":
        print(character)
        break
else:
    print("none")
