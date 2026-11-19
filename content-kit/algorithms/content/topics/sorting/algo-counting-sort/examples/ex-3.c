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

int main(void)
{
    int a[] = {5, 5, 1, 3, 1};
    sort(a, 5);
    int distinct = 1;
    for (int i = 1; i < 5; i++) {
        if (a[i] != a[i - 1]) {
            distinct++;
        }
    }
    printf("distinct = %d\n", distinct);
    return 0;
}
