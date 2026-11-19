#include <stdio.h>

int main(void)
{
    int a[4];
    puts("Four values:");
    for (size_t i = 0; i < 4; i++) {
        if (scanf("%d", &a[i]) != 1 || a[i] < -100 || a[i] > 100) {
            return 1;
        }
    }
    int total = 0;
    for (int *p = a; p != a + 4; p++) {
        total += *p;
    }
    printf("%d\n", total);
    return 0;
}
