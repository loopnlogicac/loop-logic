#include <stdio.h>

static void sort(int a[], int n)
{
    /* Keys are -99..99; shift each key by 99 for an array index. */
    int count[199] = {0};
    int output[64];
    for (int i = 0; i < n; i++) {
        count[a[i] + 99]++;
    }
    for (int key = 1; key < 199; key++) {
        count[key] += count[key - 1];
    }
    for (int i = n - 1; i >= 0; i--) {
        int key = a[i] + 99;
        output[--count[key]] = a[i];
    }
    for (int i = 0; i < n; i++) {
        a[i] = output[i];
    }
}
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
    sort(a, n);
    show(a, n);
    return 0;
}
