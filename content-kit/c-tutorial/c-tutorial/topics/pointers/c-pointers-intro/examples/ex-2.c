#include <stdio.h>

int main(void)
{
    int a = 10, b = 20;
    int *p = &a;
    int *q = p;
    p = &b;
    *q = 15;
    printf("%d %d %d\n", a, *p, *q);
    return 0;
}
