#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    int a[] = {3, 6, 9};
    int *end = a + 3;
    printf("%td %d\n", end - a, *(end - 1));
    return 0;
}
