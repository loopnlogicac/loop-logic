import json


def add(a, b):
    return [a[0] + b[0], a[1] + b[1]]


def main():
    a, b, scale = [2, 1], [1, 3], 2
    total = add(a, b)
    scaled = [scale * value for value in total]
    print(json.dumps(dict(sumX=total[0], sumY=total[1],
                          scaledX=scaled[0], scaledY=scaled[1]), sort_keys=True))


if __name__ == "__main__":
    main()
