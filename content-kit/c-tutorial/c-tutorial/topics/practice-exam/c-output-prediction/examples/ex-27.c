#include <stdio.h>
#include <string.h>
#include <stddef.h>

static int twice(int value)
{
    return value * 2;
}

int main(void)
{
    int i = 3;
    int value = twice(i++);
    printf("%d %d\n", value, i);
    return 0;
}
