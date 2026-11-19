#include <stdio.h>

void swap_copies(int a, int b)
{
    int temporary = a;
    a = b;
    b = temporary;
    printf("inside: %d %d\n", a, b);
}

int main(void)
{
    int a = 12, b = 30;
    swap_copies(a, b);
    printf("caller: %d %d\n", a, b);
    return 0;
}
