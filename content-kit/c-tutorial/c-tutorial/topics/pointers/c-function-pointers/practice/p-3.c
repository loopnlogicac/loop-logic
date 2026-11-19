#include <stdio.h>
#include <stdlib.h>

int compare_ints(const void *left, const void *right)
{
    const int *a = left;
    const int *b = right;
    return (*a > *b) - (*a < *b);
}

int main(void)
{
    int a[4];
    puts("Sort values:");
    for (size_t i = 0; i < 4; i++) {
        if (scanf("%d", &a[i]) != 1 || a[i] < -100 || a[i] > 100) {
            return 1;
        }
    }
    qsort(a, 4, sizeof a[0], compare_ints);
    for (size_t i = 0; i < 4; i++) {
        printf("%s%d", i == 0 ? "" : " ", a[i]);
    }
    putchar('\n');
    return 0;
}
