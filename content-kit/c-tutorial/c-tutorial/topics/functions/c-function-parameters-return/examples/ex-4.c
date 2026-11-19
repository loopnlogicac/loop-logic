#include <stdio.h>

void divide_parts(int total, int group, int *quotient, int *remainder)
{
    *quotient = total / group;
    *remainder = total % group;
}

int main(void)
{
    int quotient, remainder;
    divide_parts(17, 5, &quotient, &remainder);
    printf("%d %d\n", quotient, remainder);
    return 0;
}
