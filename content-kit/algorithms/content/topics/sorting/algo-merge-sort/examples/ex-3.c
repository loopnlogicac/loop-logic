#include <stdio.h>

static void merge_sort(int a[], int temp[], int low, int high)
{
    if (high - low < 2) {
        return;
    }
    int mid = low + (high - low) / 2;
    merge_sort(a, temp, low, mid);
    merge_sort(a, temp, mid, high);
    int i = low;
    int j = mid;
    int k = low;
    while (i < mid && j < high) {
        temp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
    }
    while (i < mid) {
        temp[k++] = a[i++];
    }
    while (j < high) {
        temp[k++] = a[j++];
    }
    for (k = low; k < high; k++) {
        a[k] = temp[k];
    }
}
static void sort(int a[], int n)
{
    int temp[64];
    merge_sort(a, temp, 0, n);
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
