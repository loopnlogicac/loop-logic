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
static void show(const int a[], int n)
{
    for (int i = 0; i < n; i++) {
        printf("%s%d", i ? " " : "", a[i]);
    }
    puts("");
}

int main(void)
{
    int a[] = {7, 3, 5, 3, 1};
    sort(a, 5);
    show(a, 5);
    return 0;
}
