#include <stdio.h>

static void show(const int a[], int n)
{
    for (int i = 0; i < n; i++) {
        printf("%s%d", i ? " " : "", a[i]);
    }
    puts("");
}
static void radix_passes(int a[], int n)
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
        printf("place %d: ", place);
        show(a, n);
    }
}

int main(void)
{
    int a[] = {-99, 0, -98, 99, 1};
    radix_passes(a, 5);
    return 0;
}
