#include <stdio.h>

int main(void)
{
    int a[] = {7, 8, 9};
    int *p = a;
    p++;
    printf("%d %d\n", *p, a[0]);
    return 0;
}
