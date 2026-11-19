#include <stdio.h>

int main(void)
{
    int marks = 70;
    int *p = &marks;
    *p = 85;
    printf("%d %d\n", marks, *p);
    return 0;
}
