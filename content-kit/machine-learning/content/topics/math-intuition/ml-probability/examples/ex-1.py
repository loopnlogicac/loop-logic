import json


def main():
    state, heads, trials = 7, 0, 100
    for _ in range(trials):
        state = (1664525 * state + 1013904223) % (2**32)
        heads += state / (2**32) < 0.5
    print(json.dumps(dict(heads=heads, trials=trials,
                          frequency=round(heads/trials, 3)), sort_keys=True))


if __name__ == "__main__":
    main()
