#include <stdio.h>

static int count(const int a[], int lo, int hi, int target)
{
    if (lo == hi) { return 0; }
    if (hi - lo == 1) { return a[lo] == target; }
    int mid = lo + (hi - lo) / 2;
    return count(a, lo, mid, target) + count(a, mid, hi, target);
}

int main(void)
{
    int n, values[16];
    puts("Enter n and values:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 16) { return 1; }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -99 || values[i] > 99) { return 1; }
    }
    int target;
    if (scanf("%d", &target) != 1) { return 1; }
    printf("matches = %d\n", count(values, 0, n, target));
    return 0;
}
