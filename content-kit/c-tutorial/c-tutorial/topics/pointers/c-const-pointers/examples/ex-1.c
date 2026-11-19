#include <stdio.h>

int main(void)
{
    int a = 7, b = 9;
    const int *p = &a;
    p = &b;
    b = 10;
    printf("%d\n", *p);
    return 0;
}
