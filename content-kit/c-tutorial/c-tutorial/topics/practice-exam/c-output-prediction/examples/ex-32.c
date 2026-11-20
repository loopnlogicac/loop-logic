#include <stdio.h>
#include <string.h>
#include <stddef.h>

static int accumulate(int value)
{
    static int total;
    total += value;
    return total;
}

int main(void)
{
    int first = accumulate(3);
    int second = accumulate(5);
    printf("%d %d\n", first, second);
    return 0;
}
