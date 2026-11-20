#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    int a = 5;
    int b = 9;
    int *p = &a;
    int **link = &p;
    *link = &b;
    printf("%d %d\n", *p, a);
    return 0;
}
