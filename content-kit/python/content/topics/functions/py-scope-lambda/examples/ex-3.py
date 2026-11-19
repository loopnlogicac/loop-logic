def make_counter(start):
    count = start

    def next_count():
        nonlocal count
        count += 1
        return count

    return next_count


first = make_counter(10)
second = make_counter(0)
print(first(), first(), second())
