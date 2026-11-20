#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    int sign = strcmp("18", "19") < 0;
    printf("%d\n", sign);
    return 0;
}
