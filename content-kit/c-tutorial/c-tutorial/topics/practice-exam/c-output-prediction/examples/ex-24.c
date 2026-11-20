#include <stdio.h>
#include <string.h>
#include <stddef.h>

#define SUM_BAD 2 + 1

int main(void)
{
    printf("%d\n", 3 * SUM_BAD);
    return 0;
}
