#include <stdio.h>

int main(void)
{
    int a;
    int b;
    if (scanf("%d%d", &a, &b) != 2 || a < 1 || a > 1000 || b < 1 || b > 1000) {
        puts("invalid");
        return 0;
    }
    int x = a;
    int y = b;
    while (y != 0) {
        int remainder = x % y;
        x = y;
        y = remainder;
    }
    long lcm = (long)(a / x) * b;
    printf("%ld\n", lcm);
    return 0;
}
