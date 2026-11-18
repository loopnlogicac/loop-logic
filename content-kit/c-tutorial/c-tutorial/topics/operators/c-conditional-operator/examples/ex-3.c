#include <stdio.h>

int main(void)
{
    int a = 88;
    int b = 91;
    int c = 91;
    int candidate = a > b ? a : b;
    int maximum = candidate > c ? candidate : c;
    printf("%d\n", maximum);
    return 0;
}
