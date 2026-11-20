import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

def main():
    data = pd.read_csv("sms.csv")
    x_train, x_test, y_train, y_test = train_test_split(
        data["text"], data["label"], test_size=0.25, stratify=data["label"], random_state=0
    )
    model = make_pipeline(
        CountVectorizer(tokenizer=str.split, token_pattern=None), MultinomialNB(alpha=1)
    )
    model.fit(x_train, y_train)
    print(f"Training messages: {len(y_train)}")
    print(f"Vocabulary size: {len(model[0].vocabulary_)}")
    print(f"Test accuracy: {model.score(x_test, y_test):.3f}")


if __name__ == "__main__":
    main()
