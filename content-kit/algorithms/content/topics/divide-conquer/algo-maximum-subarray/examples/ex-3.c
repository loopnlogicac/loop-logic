#include <stdio.h>

static int brute(const int a[], int n)
{
    int best = a[0];
    for (int lo = 0; lo < n; lo++) {
        int sum = 0;
        for (int hi = lo; hi < n; hi++) {
            sum += a[hi];
            if (sum > best) { best = sum; }
        }
    }
    return best;
}

int main(void)
{
    int a[] = {-8,-3,-6};
    printf("%d\n", brute(a, 3));
    return 0;
}
