visits = 0


def record_visit():
    global visits
    visits += 1


record_visit()
record_visit()
print(visits)
