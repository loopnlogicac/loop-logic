#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void)
{
    int h;
    unsigned long width = 1, total = 1;
    puts("Height (0..20):");
    if (scanf("%d", &h) != 1 || h < 0 || h > 20) {
        return 1;
    }
    for (int d = 1; d <= h; d++) {
        width *= 2;
        total += width;
    }
    printf("leaves=%lu nodes=%lu\n", width, total);
    return 0;
}
