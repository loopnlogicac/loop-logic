#include <stdio.h>

static void swap(int *x, int *y)
{
    int saved = *x;
    *x = *y;
    *y = saved;
}
static int partition_hoare(int a[], int low, int high)
{
    int pivot = a[low + (high - low) / 2];
    int i = low - 1;
    int j = high + 1;
    for (;;) {
        do {
            i++;
        } while (a[i] < pivot);
        do {
            j--;
        } while (a[j] > pivot);
        if (i >= j) {
            return j;
        }
        swap(&a[i], &a[j]);
    }
}
static void hoare_sort(int a[], int low, int high)
{
    if (low < high) {
        int split = partition_hoare(a, low, high);
        hoare_sort(a, low, split);
        hoare_sort(a, split + 1, high);
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
    hoare_sort(a, 0, 4);
    show(a, 5);
    return 0;
}
