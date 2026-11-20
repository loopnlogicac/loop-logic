#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    int a[] = {10, 20};
    int *p = a;
    ++*p;
    printf("%d %d\n", a[0], p == a);
    return 0;
}
