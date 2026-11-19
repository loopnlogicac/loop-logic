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
    int a[] = {8};
    printf("%d %d\n", sum_range(a, 0, 0), sum_range(a, 0, 1));
    return 0;
}
