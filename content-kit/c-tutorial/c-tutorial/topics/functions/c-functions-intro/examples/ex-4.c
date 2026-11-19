#include <stdio.h>
#include <stdlib.h>

int distance_from_zero(int value)
{
    return abs(value);
}

int main(void)
{
    printf("%d\n", distance_from_zero(-18));
    return 0;
}
