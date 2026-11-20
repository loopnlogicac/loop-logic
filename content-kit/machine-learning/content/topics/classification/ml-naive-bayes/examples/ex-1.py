import math

VOCABULARY = ("free", "ক্লাস")
MESSAGES = [
    ("free free", 1), ("free ফ্রি", 1), ("free win", 1),
    ("ক্লাস ক্লাস", 0), ("ক্লাস meet", 0), ("ক্লাস class", 0),
]


def fit_counts(messages):
    counts = [[0, 0], [0, 0]]
    documents = [0, 0]
    for text, label in messages:
        documents[label] += 1
        for word in text.lower().split():
            if word in VOCABULARY:
                counts[label][VOCABULARY.index(word)] += 1
    return counts, documents


def classify_text(messages, query, alpha=1.0):
    counts, documents = fit_counts(messages)
    scores = [math.log(n / sum(documents)) for n in documents]
    for word in query.lower().split():
        if word not in VOCABULARY:
            continue
        index = VOCABULARY.index(word)
        for label in (0, 1):
            probability = (counts[label][index] + alpha) / (sum(counts[label]) + 2 * alpha)
            scores[label] += math.log(probability)
    return int(scores[1] > scores[0]), scores

def main():
    prediction, scores = classify_text(MESSAGES, "free free", alpha=1)
    print(f"prediction {prediction}")
    print(f"logScore0 {scores[0]:.3f}")
    print(f"logScore1 {scores[1]:.3f}")


if __name__ == "__main__":
    main()
