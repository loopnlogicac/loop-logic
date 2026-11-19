#include <stdio.h>

typedef int *IntPointer;

int main(void)
{
    int value = 4;
    IntPointer const fixed_pointer = &value;
    *fixed_pointer = 9;
    const int *read_only = &value;
    printf("%d %d\n", value, *read_only);
    return 0;
}
