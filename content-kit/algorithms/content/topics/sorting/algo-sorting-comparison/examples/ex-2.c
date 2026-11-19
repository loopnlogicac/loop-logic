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
    puts("Enter n, then n values:");
    int n;
    int a[64];
    if (scanf("%d", &n) != 1 || n < 0 || n > 64) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &a[i]) != 1 || a[i] < -99 || a[i] > 99) {
            return 1;
        }
    }
    sort(a, n);
    show(a, n);
    return 0;
}
