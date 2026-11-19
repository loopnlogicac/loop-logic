def is_palindrome(text):
    """Check a lowercase phrase while ignoring spaces."""
    cleaned = text.replace(" ", "")
    return cleaned == cleaned[::-1]


for line_number in range(2):
    print("YES" if is_palindrome(input()) else "NO")
