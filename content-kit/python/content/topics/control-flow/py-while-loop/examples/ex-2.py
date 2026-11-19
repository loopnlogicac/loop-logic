value = int(input("Mark, or -1 to stop: "))
total = 0
count = 0
# The end signal must not enter the total.
while value != -1:
    total += value
    count += 1
    value = int(input("Mark, or -1 to stop: "))
print(f"Count: {count}, total: {total}")
