#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    int n = 3;
    int count = 0;
    while (n-- > 0) {
        ++count;
    }
    printf("%d %d\n", count, n);
    return 0;
}
