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
