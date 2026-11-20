from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

def main():
    messages = [("free free", 1), ("free ফ্রি", 1), ("free win", 1),
                ("ক্লাস ক্লাস", 0), ("ক্লাস meet", 0), ("ক্লাস class", 0)]
    vectorizer = CountVectorizer(
        vocabulary=["free", "ক্লাস"], tokenizer=str.split, token_pattern=None
    )
    x = vectorizer.fit_transform([text for text, _ in messages])
    y = [label for _, label in messages]
    model = MultinomialNB(alpha=1)
    model.fit(x, y)
    query = vectorizer.transform(["free free"])
    scores = [float(model.class_log_prior_[i] + query.dot(model.feature_log_prob_[i])[0])
              for i in (0, 1)]
    prediction = int(model.predict(query)[0])
    print(f"prediction {prediction}")
    print(f"logScore0 {scores[0]:.3f}")
    print(f"logScore1 {scores[1]:.3f}")


if __name__ == "__main__":
    main()
