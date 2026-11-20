#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    static int counts[3];
    counts[1] += 4;
    printf("%d %d %d\n", counts[0], counts[1], counts[2]);
    return 0;
}
