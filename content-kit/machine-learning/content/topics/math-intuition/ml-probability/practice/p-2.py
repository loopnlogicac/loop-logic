seed_text, probability_text, trials_text = input().split()
state, probability, trials = int(seed_text), float(probability_text), int(trials_text)
heads = 0
for _ in range(trials):
    state = (1664525*state+1013904223) % (2**32)
    heads += state/(2**32) < probability
print(heads)
print(f"{heads/trials:.3f}")
