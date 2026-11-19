def make_prefixer(prefix):
    def attach(text):
        return prefix + text
    return attach


prefixer = make_prefixer(input())
for line_number in range(int(input())):
    print(prefixer(input()))
