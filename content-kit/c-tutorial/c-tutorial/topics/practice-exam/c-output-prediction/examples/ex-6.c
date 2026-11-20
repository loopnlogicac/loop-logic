#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    int x = 1;
    int result = (x += 2, x * 3);
    printf("%d %d\n", x, result);
    return 0;
}
