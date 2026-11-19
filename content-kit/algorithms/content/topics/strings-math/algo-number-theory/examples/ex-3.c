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
    long long a, modulus, x, y;
    puts("a and modulus (a 0..1000000, modulus 2..1000000):");
    if (scanf("%lld%lld", &a, &modulus) != 2 || a < 0 || a > 1000000 ||
        modulus < 2 || modulus > 1000000) {
        return 1;
    }
    long long gcd = extended(a, modulus, &x, &y);
    if (gcd != 1) {
        puts("No inverse");
    } else {
        printf("Inverse: %lld\n", (x % modulus + modulus) % modulus);
    }
    return 0;
}
