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
