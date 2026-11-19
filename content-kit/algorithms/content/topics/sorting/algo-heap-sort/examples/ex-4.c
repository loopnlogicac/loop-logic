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
    int a[] = {1, 2, 3, 4, 5};
    for (int root = 5 / 2 - 1; root >= 0; root--) {
        sift(a, 5, root);
    }
    show(a, 5);
    return 0;
}
