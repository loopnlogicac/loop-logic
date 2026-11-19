#include <stdio.h>

static int kadane(const int a[], int n)
{
    int ending = a[0], best = a[0];
    for (int i = 1; i < n; i++) {
        ending = a[i] > ending + a[i] ? a[i] : ending + a[i];
        if (ending > best) { best = ending; }
    }
    return best;
}

int main(void)
{
    int n, values[16];
    puts("Enter n and values:");
    if (scanf("%d", &n) != 1 || n < 1 || n > 16) { return 1; }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -99 || values[i] > 99) { return 1; }
    }
    printf("best = %d\n", kadane(values, n));
    return 0;
}
