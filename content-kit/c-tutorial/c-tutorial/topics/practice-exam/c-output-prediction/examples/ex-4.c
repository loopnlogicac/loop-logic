#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    unsigned int a = 6U;
    unsigned int b = 3U;
    printf("%u %d\n", a & b, a && b);
    return 0;
}
