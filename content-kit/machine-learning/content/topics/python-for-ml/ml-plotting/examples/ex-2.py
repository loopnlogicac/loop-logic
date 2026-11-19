import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt


def main():
    overs = [1, 2, 3, 4, 5, 6]
    runs = [4, 7, 13, 15, 22, 30]
    fig, ax = plt.subplots(figsize=(6, 4))
    ax.plot(overs, runs, marker="o", label="Team total")
    ax.set(title="Six invented cricket overs", xlabel="Completed overs",
           ylabel="Cumulative runs", xticks=overs)
    ax.legend()
    fig.tight_layout()
    fig.savefig("cricket-line.png", dpi=110)
    plt.close(fig)
    print("Saved cricket-line.png: cumulative runs increase across six ordered overs.")


if __name__ == "__main__":
    main()
