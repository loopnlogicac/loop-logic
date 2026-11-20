#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    int i;
    int sum = 0;
    for (i = 1; i <= 3; ++i) {
        sum += i;
    }
    printf("%d %d\n", i, sum);
    return 0;
}
