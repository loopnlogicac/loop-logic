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
    int values[] = {9, -4, 9, 0, 3};
    int n = 5;
    qsort(values, (size_t)n, sizeof values[0], compare_ints);
    for (int i = 0; i < n; i++) {
        printf("%s%d", i == 0 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
