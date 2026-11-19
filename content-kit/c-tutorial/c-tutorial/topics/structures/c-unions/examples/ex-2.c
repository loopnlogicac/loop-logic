#include <stdio.h>

union Value { int count; double amount; };

int main(void)
{
    printf("Fits int: %d Fits double: %d\n", sizeof(union Value) >= sizeof(int),
           sizeof(union Value) >= sizeof(double));
    return 0;
}
