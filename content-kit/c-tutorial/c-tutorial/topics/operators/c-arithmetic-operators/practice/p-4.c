#include <stdio.h>

int main(void)
{
    int a, b;
    printf("Input: ");
    if (scanf("%d %d", &a, &b) != 2 || a < -1000 || a > 1000 || b < -20 || b > 20 || b == 0) {
        return 1;
    }
    int q = a / b;
    int r = a % b;
    printf("%d %d %d\n", q, r, q * b + r);
    return 0;
}
