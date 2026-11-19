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
    int a[] = {7, 3, 5, 3, 1};
    printf("sum = %d\n", sum_range(a, 0, 5));
    return 0;
}
