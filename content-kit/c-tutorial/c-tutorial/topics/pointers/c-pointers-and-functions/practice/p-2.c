#include <stdio.h>

void difference(int a, int b, int *out)
{
    *out = a >= b ? a - b : b - a;
}

int main(void)
{
    int a, b;
    puts("Two integers (-100 to 100):");
    if (scanf("%d %d", &a, &b) != 2 || a < -100 || a > 100 || b < -100 || b > 100) {
        return 1;
    }
    int result;
    difference(a, b, &result);
    printf("%d\n", result);
    return 0;
}
