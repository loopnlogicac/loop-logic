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
    int best = -1;
    for (int i = 0; i < n; i++) {
        if (best == -1 || a[i] > a[best]) {
            best = i;
        }
    }
    printf("index = %d\n", best);
    return 0;
}
