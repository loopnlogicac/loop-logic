import json

sick, healthy = 10, 990
true_positive = sick * 0.9
false_positive = healthy * 0.1
positive = true_positive + false_positive
print(json.dumps(dict(truePositive=true_positive, falsePositive=false_positive,
                      positive=positive, posterior=round(true_positive/positive, 3)),
                 sort_keys=True))
