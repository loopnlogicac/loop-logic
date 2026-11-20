#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    int n = 0;
    do {
        ++n;
    } while (n < 0);
    printf("%d\n", n);
    return 0;
}
