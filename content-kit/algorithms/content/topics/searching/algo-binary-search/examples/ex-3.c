#include <stdio.h>

static int lower_bound(const int a[], int n, int target)
{
    int low = 0;
    int high = n;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (a[mid] < target) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    return low;
}
static int upper_bound(const int a[], int n, int target)
{
    int low = 0;
    int high = n;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (a[mid] <= target) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    return low;
}

int main(void)
{
    int a[] = {1, 3, 3, 5, 7};
    printf("bounds = %d %d\n", lower_bound(a, 5, 3), upper_bound(a, 5, 3));
    return 0;
}
