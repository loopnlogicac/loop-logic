#include <stdio.h>

enum { CAPACITY = 8, PASS_MARK = 40 };

static int count_passes(const int marks[], int count)
{
    int passes = 0;
    for (int i = 0; i < count; ++i) {
        if (marks[i] >= PASS_MARK) {
            ++passes;
        }
    }
    return passes;
}

int main(void)
{
    int count;
    int marks[CAPACITY];
    if (scanf("%d", &count) != 1 || count < 0 || count > CAPACITY) {
        puts("invalid");
        return 0;
    }
    for (int i = 0; i < count; ++i) {
        if (scanf("%d", &marks[i]) != 1 || marks[i] < 0 || marks[i] > 100) {
            puts("invalid");
            return 0;
        }
    }
    printf("%d\n", count_passes(marks, count));
    return 0;
}
