import json
import numpy as np


def main():
    state = 7
    samples = []
    for _ in range(100):
        state = (1664525 * state + 1013904223) % (2**32)
        samples.append(state / (2**32))
    heads = int((np.array(samples) < 0.5).sum())
    print(json.dumps(dict(heads=heads, trials=100, frequency=round(heads/100, 3)),
                     sort_keys=True))


if __name__ == "__main__":
    main()
