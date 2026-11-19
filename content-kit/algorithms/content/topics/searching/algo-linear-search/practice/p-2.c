#include <stdio.h>


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
    int count = 0;
    for (int i = 0; i < n; i++) {
        count += a[i] == target;
    }
    printf("matches = %d\n", count);
    return 0;
}
