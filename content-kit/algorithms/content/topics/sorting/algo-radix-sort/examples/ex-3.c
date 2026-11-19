#include <stdio.h>

static void sort(int a[], int n)
{
    /* Three decimal passes cover all shifted keys 0..198. */
    for (int place = 1; place <= 100; place *= 10) {
        int count[10] = {0};
        int output[64];
        for (int i = 0; i < n; i++) {
            count[((a[i] + 99) / place) % 10]++;
        }
        for (int digit = 1; digit < 10; digit++) {
            count[digit] += count[digit - 1];
        }
        for (int i = n - 1; i >= 0; i--) {
            int digit = ((a[i] + 99) / place) % 10;
            output[--count[digit]] = a[i];
        }
        for (int i = 0; i < n; i++) {
            a[i] = output[i];
        }
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
