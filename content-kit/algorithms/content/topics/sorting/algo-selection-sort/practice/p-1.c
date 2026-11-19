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
    puts("Enter start:");
    int start;
    if (scanf("%d", &start) != 1 || start < 0 || start > n) {
        return 1;
    }
    int min = -1;
    for (int j = start; j < n; j++) {
        if (min == -1 || a[j] < a[min]) {
            min = j;
        }
    }
    printf("min index = %d\n", min);
    return 0;
}
