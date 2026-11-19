import sys


def main():
    tokens = iter(map(int, sys.stdin.buffer.read().split()))
    count, queries = next(tokens), next(tokens)
    prefix = [0]
    for _ in range(count):
        prefix.append(prefix[-1] + next(tokens))
    answers = []
    for _ in range(queries):
        left, right = next(tokens), next(tokens)
        answers.append(str(prefix[right] - prefix[left - 1]))
    sys.stdout.write("\n".join(answers) + "\n")


if __name__ == "__main__":
    main()
