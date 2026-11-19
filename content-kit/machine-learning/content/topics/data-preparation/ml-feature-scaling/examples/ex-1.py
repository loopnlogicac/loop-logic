from math import sqrt
rows = [[1, 100], [2, 900], [3, 300], [3, 680], [5, 500], [6, 600]]
query = [3, 800]
lows = [min(row[j] for row in rows) for j in range(2)]
spans = [max(row[j] for row in rows) - lows[j] for j in range(2)]
scaled = [[(row[j] - lows[j]) / (spans[j] or 1) for j in range(2)] for row in rows]
q = [(query[j] - lows[j]) / (spans[j] or 1) for j in range(2)]
def nearest(data, target):
    return min(range(len(data)), key=lambda i: sum((data[i][j]-target[j])**2
                                                 for j in range(2))) + 1
if __name__ == "__main__":
    print(f"Raw nearest: {nearest(rows, query)}")
    print(f"Scaled nearest: {nearest(scaled, q)}")
    print(f"First: {scaled[0][0]:.3f}, {scaled[0][1]:.3f}")
