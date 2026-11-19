#include <stdio.h>

typedef int *IntPointer;

int main(void)
{
    int value = 10;
    IntPointer first = &value, second = &value;
    *second = 25;
    printf("%d %d\n", *first, *second);
    return 0;
}
