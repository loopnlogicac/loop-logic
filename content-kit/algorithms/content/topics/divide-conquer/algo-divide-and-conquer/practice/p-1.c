#include <stdio.h>

static int sum_range(const int a[], int lo, int hi)
{
    if (hi == lo) { return 0; }
    if (hi - lo == 1) { return a[lo]; }
    int mid = lo + (hi - lo) / 2;
    return sum_range(a, lo, mid) + sum_range(a, mid, hi);
}

int main(void)
{
    int n, values[16];
    puts("Enter n and values:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) { return 1; }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -99 || values[i] > 99) { return 1; }
    }
    printf("sum = %d\n", sum_range(values, 0, n));
    return 0;
}
