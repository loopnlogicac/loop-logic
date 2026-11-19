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
    puts("Enter target:");
    int target;
    if (scanf("%d", &target) != 1) {
        return 1;
    }
    printf("matches = %d\n", upper_bound(a, n, target) - lower_bound(a, n, target));
    return 0;
}
