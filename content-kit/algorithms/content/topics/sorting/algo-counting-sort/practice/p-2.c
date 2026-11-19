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
    int count[199] = {0};
    for (int i = 0; i < n; i++) {
        count[a[i] + 99]++;
    }
    int any = 0;
    for (int key = 0; key < 199; key++) {
        if (count[key] > 0) {
            printf("%d:%d\n", key - 99, count[key]);
            any = 1;
        }
    }
    if (!any) {
        puts("Empty");
    }
    return 0;
}
