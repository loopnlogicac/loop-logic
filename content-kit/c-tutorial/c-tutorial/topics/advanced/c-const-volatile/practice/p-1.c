#include <stdio.h>

static int maximum(const int marks[], int count)
{
    int best = marks[0];
    for (int i = 1; i < count; ++i) {
        if (marks[i] > best) {
            best = marks[i];
        }
    }
    return best;
}

int main(void)
{
    int n;
    int marks[10];
    if (scanf("%d", &n) != 1 || n < 1 || n > 10) {
        puts("invalid");
        return 0;
    }
    for (int i = 0; i < n; ++i) {
        if (scanf("%d", &marks[i]) != 1 || marks[i] < 0 || marks[i] > 100) {
            puts("invalid");
            return 0;
        }
    }
    printf("%d\n", maximum(marks, n));
    return 0;
}
