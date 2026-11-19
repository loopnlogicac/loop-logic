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
    if (n == 0) {
        puts("No middle");
    } else {
        printf("middle = %d\n", a[(n - 1) / 2]);
    }
    return 0;
}
