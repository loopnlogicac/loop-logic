#include <stdio.h>

static int maximum(const int a[], int lo, int hi)
{
    if (hi - lo == 1) { return a[lo]; }
    int mid = lo + (hi - lo) / 2;
    int left = maximum(a, lo, mid), right = maximum(a, mid, hi);
    return left > right ? left : right;
}

int main(void)
{
    int a[] = {-4, -7, -2};
    printf("maximum = %d\n", maximum(a, 0, 3));
    return 0;
}
