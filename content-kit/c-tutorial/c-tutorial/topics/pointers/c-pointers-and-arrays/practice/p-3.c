#include <stdio.h>

int maximum(const int *a, size_t n)
{
    int best = *a;
    for (size_t i = 1; i < n; i++) {
        if (*(a + i) > best) {
            best = *(a + i);
        }
    }
    return best;
}

int main(void)
{
    int a[4];
    puts("Four marks:");
    for (size_t i = 0; i < 4; i++) {
        if (scanf("%d", &a[i]) != 1 || a[i] < -100 || a[i] > 100) {
            return 1;
        }
    }
    printf("%d\n", maximum(a, 4));
    return 0;
}
