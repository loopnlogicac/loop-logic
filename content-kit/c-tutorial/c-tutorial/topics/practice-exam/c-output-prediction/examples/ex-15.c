#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    int a[] = {2, 4, 6, 8};
    int *p = &a[1];
    int *q = &a[3];
    printf("%td\n", q - p);
    return 0;
}
