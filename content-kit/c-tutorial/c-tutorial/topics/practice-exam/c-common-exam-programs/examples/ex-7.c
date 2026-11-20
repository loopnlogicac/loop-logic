#include <stdio.h>

int main(void)
{
    unsigned long n;
    if (scanf("%lu", &n) != 1 || n > 1000000000UL) {
        puts("invalid");
        return 0;
    }
    unsigned int sum = 0;
    while (n != 0) {
        sum += (unsigned int)(n % 10UL);
        n /= 10UL;
    }
    printf("%u\n", sum);
    return 0;
}
