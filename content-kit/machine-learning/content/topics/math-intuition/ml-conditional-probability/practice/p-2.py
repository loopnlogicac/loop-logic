sick, sensitivity, rate = map(float, input().split())
tp, fp = sick*sensitivity, (1000-sick)*rate
print(f"{tp:.3f} {sick-tp:.3f} {fp:.3f} {1000-sick-fp:.3f}")
print(f"{tp/(tp+fp):.3f}" if tp+fp > 0 else "undefined")
