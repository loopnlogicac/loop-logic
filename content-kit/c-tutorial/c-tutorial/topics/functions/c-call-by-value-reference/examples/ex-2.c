#include <stdio.h>

void swap(int *a, int *b)
{
    int temporary = *a;
    *a = *b;
    *b = temporary;
}

int main(void)
{
    int a = 12, b = 30;
    swap(&a, &b);
    printf("%d %d\n", a, b);
    return 0;
}
