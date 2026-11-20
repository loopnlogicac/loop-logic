#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    int n = 0;
    int result = n != 0 && ++n;
    printf("%d %d\n", result, n);
    return 0;
}
