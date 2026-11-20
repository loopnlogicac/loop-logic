#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    int x = 2;
    int y = 8;
    int chosen = x > y ? ++x : ++y;
    printf("%d %d %d\n", x, y, chosen);
    return 0;
}
