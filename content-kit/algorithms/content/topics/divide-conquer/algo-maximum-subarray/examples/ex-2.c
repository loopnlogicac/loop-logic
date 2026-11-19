#include <stdio.h>

static int maximum(const int a[], int lo, int hi)
{
    if (hi - lo == 1) { return a[lo]; }
    int mid = lo + (hi - lo) / 2;
    int left = maximum(a, lo, mid), right = maximum(a, mid, hi);
    int sum = 0, suffix = a[mid - 1], prefix = a[mid];
    for (int i = mid - 1; i >= lo; i--) {
        sum += a[i];
        if (sum > suffix) { suffix = sum; }
    }
    sum = 0;
    for (int i = mid; i < hi; i++) {
        sum += a[i];
        if (sum > prefix) { prefix = sum; }
    }
    int best = left > right ? left : right;
    return best > suffix + prefix ? best : suffix + prefix;
}

int main(void)
{
    int a[] = {-2, 3, -1, 4, -5};
    printf("%d\n", maximum(a, 0, 5));
    return 0;
}
