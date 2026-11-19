#include <stdio.h>

void swap(int *left, int *right)
{
    int temp = *left;
    *left = *right;
    *right = temp;
}

int main(void)
{
    int a = 40, b = 90;
    swap(&a, &b);
    printf("%d %d\n", a, b);
    return 0;
}
