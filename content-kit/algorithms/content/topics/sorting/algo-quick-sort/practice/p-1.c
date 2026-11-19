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
    if (n == 0) {
        puts("pivot index = -1");
    } else {
        printf("pivot index = %d\n", partition(a, 0, n - 1));
    }
    show(a, n);
    return 0;
}
