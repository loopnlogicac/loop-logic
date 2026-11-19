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
    int passes = 0;
    for (int pass = 0; pass < n - 1; pass++) {
        int swapped = 0;
        passes++;
        for (int j = 0; j < n - 1 - pass; j++) {
            if (a[j] > a[j + 1]) {
                int saved = a[j];
                a[j] = a[j + 1];
                a[j + 1] = saved;
                swapped = 1;
            }
        }
        if (!swapped) {
            break;
        }
    }
    printf("passes = %d\n", passes);
    return 0;
}
