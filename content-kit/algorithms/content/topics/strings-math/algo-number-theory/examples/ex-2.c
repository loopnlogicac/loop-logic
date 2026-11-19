#include <stdio.h>

static long long extended(long long a, long long b, long long *x, long long *y)
{
    if (b == 0) {
        *x = 1;
        *y = 0;
        return a;
    }
    long long next_x, next_y;
    long long gcd = extended(b, a % b, &next_x, &next_y);
    *x = next_y;
    *y = next_x - (a / b) * next_y;
    return gcd;
}
int main(void)
{
    long long a, b, x, y;
    puts("a and b (0..1000000, not both zero):");
    if (scanf("%lld%lld", &a, &b) != 2 || a < 0 || b < 0 ||
        a > 1000000 || b > 1000000 || (a == 0 && b == 0)) {
        return 1;
    }
    long long gcd = extended(a, b, &x, &y);
    printf("gcd: %lld\nx: %lld y: %lld\n", gcd, x, y);
    printf("Identity: %lld\n", a * x + b * y);
    return 0;
}
