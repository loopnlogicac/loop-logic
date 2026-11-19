#include <stdio.h>

int main(void)
{
    int a, b;
    printf("Input: ");
    if (scanf("%d %d", &a, &b) != 2 || a < 0 || a > 1000000 || b < 0 || b > 1000000) {
        return 1;
    }
    int x = a;
    int y = b;
    while (y != 0) {
        int remainder = x % y;
        x = y;
        y = remainder;
    }
    long long lcm = 0;
    if (x != 0) {
        lcm = (long long)(a / x) * b;
    }
    printf("%d %lld\n", x, lcm);
    return 0;
}
