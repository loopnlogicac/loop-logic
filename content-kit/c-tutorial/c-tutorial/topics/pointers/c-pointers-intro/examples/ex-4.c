#include <stdio.h>

int main(void)
{
    int marks = 85;
    int *p = &marks;
    printf("target: %p\n", (void *)p);
    printf("pointer variable: %p\n", (void *)&p);
    return 0;
}
