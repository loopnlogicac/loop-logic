#include <stdio.h>
#include <string.h>
#include <stddef.h>

#define SQUARE(x) ((x) * (x))

int main(void)
{
    int value = SQUARE(2 + 1);
    printf("%d\n", value);
    return 0;
}
