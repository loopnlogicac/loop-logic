#include <stdio.h>

int main(void)
{
    int a = 48;
    int b = 18;
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
