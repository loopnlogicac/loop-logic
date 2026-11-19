#include <stdio.h>

static void swap(int *x, int *y)
{
    int saved = *x;
    *x = *y;
    *y = saved;
}
static int partition(int a[], int low, int high)
{
    int pivot = a[high];
    int i = low;
    for (int j = low; j < high; j++) {
        if (a[j] <= pivot) {
            swap(&a[i], &a[j]);
            i++;
        }
    }
    swap(&a[i], &a[high]);
    return i;
}
static void quick_sort(int a[], int low, int high)
{
    if (low < high) {
        int p = partition(a, low, high);
        quick_sort(a, low, p - 1);
        quick_sort(a, p + 1, high);
    }
}
static void sort(int a[], int n)
{
    quick_sort(a, 0, n - 1);
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
