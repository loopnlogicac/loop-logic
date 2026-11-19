#include <stdio.h>

unsigned int digit_sum(unsigned int value)
{
    if (value < 10) {
        return value;
    }
    return value % 10 + digit_sum(value / 10);
}

unsigned int gcd(unsigned int a, unsigned int b)
{
    if (b == 0) {
        return a;
    }
    return gcd(b, a % b);
}

int main(void)
{
    unsigned int a, b;
    puts("Numbers:");
    if (scanf("%u%u", &a, &b) != 2 || a > 1000000 || b > 1000000) {
        return 1;
    }
    printf("%u %u\n", digit_sum(a), gcd(a, b));
    return 0;
}
