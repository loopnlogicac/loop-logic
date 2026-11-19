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
    for (int root = n / 2 - 1; root >= 0; root--) {
        sift(a, n, root);
    }
    show(a, n);
    return 0;
}
