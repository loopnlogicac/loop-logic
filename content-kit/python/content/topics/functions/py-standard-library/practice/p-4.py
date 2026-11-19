from collections import deque


def main():
    waiting = deque(map(int, input().split()))
    served = []
    for turn in range(int(input())):
        served.append(waiting.popleft())
    print(*served)
    print(*waiting)


if __name__ == "__main__":
    main()
