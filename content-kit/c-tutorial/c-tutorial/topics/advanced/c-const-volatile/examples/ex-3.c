#include <stdio.h>

int main(void)
{
    volatile unsigned int status = 0U;
    unsigned int before = status;
    status = 4U;
    unsigned int after = status;
    const unsigned int ready_mask = 1U << 2;
    printf("Before: %u\n", before);
    printf("Ready: %d\n", (after & ready_mask) != 0U);
    return 0;
}
