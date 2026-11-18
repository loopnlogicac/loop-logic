#include <stdio.h>
#include <limits.h>

int main(void)
{
    unsigned int count = UINT_MAX;
    count = count + 1U;
    printf("Wrapped = %u\n", count);
    return 0;
}
