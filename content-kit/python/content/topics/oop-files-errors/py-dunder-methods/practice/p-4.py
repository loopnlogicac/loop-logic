class Job:
    def __init__(self, identifier, duration):
        self.identifier, self.duration = identifier, duration
    def __lt__(self, other):
        if not isinstance(other, Job):
            return NotImplemented
        return (self.duration, self.identifier) < (other.duration, other.identifier)


def main():
    jobs = [Job(*map(int, input().split())) for _ in range(int(input()))]
    print(*(job.identifier for job in sorted(jobs)))


if __name__ == "__main__":
    main()
