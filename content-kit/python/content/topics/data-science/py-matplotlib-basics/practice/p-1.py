import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt


def main():
    count = int(input())
    values = list(map(int, input().split()))
    fig, ax = plt.subplots(figsize=(6, 4))
    ax.plot(range(1, count + 1), values, marker="o")
    ax.set(xlabel="Day", ylabel="Count", title="Daily count")
    ax.set_ylim(bottom=0, top=max(1, max(values)) * 1.1)
    fig.tight_layout()
    plt.savefig("plot.png", dpi=120)
    plt.close(fig)
    print("Saved plot.png")


if __name__ == "__main__":
    main()
