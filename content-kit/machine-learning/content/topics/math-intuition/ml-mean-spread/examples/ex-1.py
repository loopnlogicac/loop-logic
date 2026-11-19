import json
import math

values = [2, 2, 3, 3, 4, 6]
mean = sum(values) / len(values)
ordered = sorted(values)
median = (ordered[2] + ordered[3]) / 2
variance = sum((value - mean) ** 2 for value in values) / len(values)
print(json.dumps(dict(mean=round(mean, 3), median=round(median, 3),
                      variance=round(variance, 3), std=round(math.sqrt(variance), 3)),
                 sort_keys=True))
