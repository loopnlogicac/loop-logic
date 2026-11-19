#include <stdio.h>

static void show(const int a[], int n)
{
    for (int i = 0; i < n; i++) {
        printf("%s%d", i ? " " : "", a[i]);
    }
    puts("");
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
    int count[10] = {0};
    int output[64];
    for (int i = 0; i < n; i++) {
        count[(a[i] + 99) % 10]++;
    }
    for (int digit = 1; digit < 10; digit++) {
        count[digit] += count[digit - 1];
    }
    for (int i = n - 1; i >= 0; i--) {
        int digit = (a[i] + 99) % 10;
        output[--count[digit]] = a[i];
    }
    show(output, n);
    return 0;
}
