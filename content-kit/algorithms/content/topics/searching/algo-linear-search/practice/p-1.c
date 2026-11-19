#include <stdio.h>

static int linear_search(const int a[], int n, int target)
{
    for (int i = 0; i < n; i++) {
        if (a[i] == target) {
            return i;
        }
    }
    return -1;
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
    printf("index = %d\n", linear_search(a, n, target));
    return 0;
}
