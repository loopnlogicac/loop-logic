#include <stdio.h>

static void swap(int *x, int *y)
{
    int saved = *x;
    *x = *y;
    *y = saved;
}
static void sift(int a[], int size, int root)
{
    while (2 * root + 1 < size) {
        int child = 2 * root + 1;
        if (child + 1 < size && a[child + 1] > a[child]) {
            child++;
        }
        if (a[root] >= a[child]) {
            break;
        }
        swap(&a[root], &a[child]);
        root = child;
    }
}
static void sort(int a[], int n)
{
    for (int root = n / 2 - 1; root >= 0; root--) {
        sift(a, n, root);
    }
    for (int end = n - 1; end > 0; end--) {
        swap(&a[0], &a[end]);
        sift(a, end, 0);
    }
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
