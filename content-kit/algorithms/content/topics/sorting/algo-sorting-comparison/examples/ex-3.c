#include <stdio.h>
#include <stdlib.h>

static int compare(const void *left, const void *right)
{
    int x = *(const int *)left;
    int y = *(const int *)right;
    return (x > y) - (x < y);
}
static void sort(int a[], int n)
{
    qsort(a, (size_t)n, sizeof a[0], compare);
}

int main(void)
{
    int a[] = {5, 5, 1, 3, 1};
    sort(a, 5);
    int distinct = 1;
    for (int i = 1; i < 5; i++) {
        if (a[i] != a[i - 1]) {
            distinct++;
        }
    }
    printf("distinct = %d\n", distinct);
    return 0;
}
