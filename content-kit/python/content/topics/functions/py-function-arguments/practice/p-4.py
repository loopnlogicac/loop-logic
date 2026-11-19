def render(words, *, separator):
    """Join words with an explicitly named separator."""
    return separator.join(words)


words = input().split()
separator = input()
print(render(words, separator=separator))
