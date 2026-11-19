#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void)
{
    unsigned int width = 1, total = 0;
    for (int depth = 0; depth <= 4; depth++) {
        total += width;
        printf("depth=%d width=%u total=%u\n", depth, width, total);
        width *= 2;
    }
    return 0;
}
