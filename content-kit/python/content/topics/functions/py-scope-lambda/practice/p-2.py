def make_counter(start):
    count = start

    def advance():
        nonlocal count
        count += 1
        return count

    return advance


start, times = [int(token) for token in input().split()]
counter = make_counter(start)
for call_number in range(times):
    print(counter())
