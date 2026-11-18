#include <stdio.h>

int main(void)
{
    int marks = -5;
    unsigned int count = 26U;
    long capacity = 100000L;
    long long ticks = 9000000000LL;
    printf("%d %i %u %ld %lld %x %o\n", marks, marks, count, capacity, ticks, count, count);
    return 0;
}
