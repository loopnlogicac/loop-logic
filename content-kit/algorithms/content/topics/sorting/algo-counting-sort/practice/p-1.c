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
    puts("Enter threshold:");
    int threshold;
    if (scanf("%d", &threshold) != 1 || threshold < -99 || threshold > 99) {
        return 1;
    }
    int count[199] = {0};
    for (int i = 0; i < n; i++) {
        count[a[i] + 99]++;
    }
    for (int key = 1; key < 199; key++) {
        count[key] += count[key - 1];
    }
    printf("at most = %d\n", count[threshold + 99]);
    return 0;
}
