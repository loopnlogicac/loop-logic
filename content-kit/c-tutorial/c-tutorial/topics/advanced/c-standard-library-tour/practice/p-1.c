#include <stdio.h>
#include <stdlib.h>

static int compare_int(const void *left, const void *right)
{
    const int a = *(const int *)left;
    const int b = *(const int *)right;
    return (a > b) - (a < b);
}

int main(void)
{
    int n;
    int marks[9];
    if (scanf("%d", &n) != 1 || n < 1 || n > 9 || n % 2 == 0) {
        puts("invalid");
        return 0;
    }
    for (int i = 0; i < n; ++i) {
        if (scanf("%d", &marks[i]) != 1 || marks[i] < 0 || marks[i] > 100) {
            puts("invalid");
            return 0;
        }
    }
    qsort(marks, (size_t)n, sizeof marks[0], compare_int);
    printf("%d\n", marks[n / 2]);
    return 0;
}
