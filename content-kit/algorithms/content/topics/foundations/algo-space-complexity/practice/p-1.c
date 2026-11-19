#include <stdio.h>

static void reverse(int a[], int n)
{
    int left = 0;
    int right = n - 1;
    while (left < right) {
        int saved = a[left];
        a[left++] = a[right];
        a[right--] = saved;
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
    reverse(a, n);
    show(a, n);
    return 0;
}
