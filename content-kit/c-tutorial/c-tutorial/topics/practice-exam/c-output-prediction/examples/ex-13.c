#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    int a[] = {10, 20, 30};
    int *p = a;
    int first = *p++;
    printf("%d %d\n", first, *p);
    return 0;
}
