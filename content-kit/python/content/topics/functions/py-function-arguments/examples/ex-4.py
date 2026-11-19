def describe(label, *scores, **details):
    """Describe numeric scores and alphabetically ordered details."""
    print(label, sum(scores))
    for key in sorted(details):
        print(f"{key}={details[key]}")


describe("lab", 10, 20, room="A2", week=3)
describe("empty")
