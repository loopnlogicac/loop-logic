#include <stdio.h>

int main(void)
{
    int a = 1, b = 2;
    int *const p = &a;
    p = &b;
    printf("%d\n", *p);
    return 0;
}
