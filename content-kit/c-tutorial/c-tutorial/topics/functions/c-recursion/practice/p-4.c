#include <stdio.h>

unsigned long long fibonacci(unsigned int n)
{
    if (n < 2) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main(void)
{
    unsigned int n;
    puts("Fibonacci n:");
    if (scanf("%u", &n) != 1 || n > 20) {
        return 1;
    }
    printf("%llu\n", fibonacci(n));
    return 0;
}
