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
    int values[] = {90, 40, 70, 40};
    qsort(values, 4, sizeof values[0], compare_ints);
    for (size_t i = 0; i < 4; i++) {
        printf("%s%d", i == 0 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
