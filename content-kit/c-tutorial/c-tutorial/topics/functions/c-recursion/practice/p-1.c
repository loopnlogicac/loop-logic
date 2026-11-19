#include <stdio.h>

unsigned long long factorial(unsigned int n)
{
    if (n == 0) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main(void)
{
    unsigned int n;
    puts("Factorial n:");
    if (scanf("%u", &n) != 1 || n > 20) {
        return 1;
    }
    printf("%llu\n", factorial(n));
    return 0;
}
