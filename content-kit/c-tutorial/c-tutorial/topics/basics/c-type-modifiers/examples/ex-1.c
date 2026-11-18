#include <stdio.h>

int main(void)
{
    short seats = 30;
    long population = 1000000L;
    long long ticks = 9000000000LL;
    printf("%hd %ld %lld\n", seats, population, ticks);
    return 0;
}
