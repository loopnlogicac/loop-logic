def combine(*words, separator=" "):
    """Join words with a keyword-only separator."""
    return separator.join(words)


words = ["CSE", "101"]
options = {"separator": "-"}
print(combine(*words, **options))
print(combine("one", "two"))
