from collections import deque


def main():
    waiting = deque([12, 18])
    waiting.append(25)
    waiting.appendleft(5)
    print(waiting.popleft())
    waiting.rotate(1)
    print(list(waiting))
    recent = deque(maxlen=2)
    recent.extend([1, 2, 3])
    print(list(recent))


if __name__ == "__main__":
    main()
