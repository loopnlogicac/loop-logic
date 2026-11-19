#include <stdio.h>

int main(void)
{
    unsigned int flags = 1U;
    flags |= 4U;
    flags ^= 1U;
    flags <<= 1;
    printf("%u\n", flags);
    return 0;
}
