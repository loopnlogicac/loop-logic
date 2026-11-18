#include <stdio.h>

int main(void)
{
    unsigned int flags = 2U;
    unsigned int mask = 1U << 2;
    flags |= mask;
    printf("%u ", flags);
    flags &= ~2U;
    printf("%u ", flags);
    flags ^= mask;
    printf("%u %d\n", flags, (flags & mask) != 0U);
    return 0;
}
