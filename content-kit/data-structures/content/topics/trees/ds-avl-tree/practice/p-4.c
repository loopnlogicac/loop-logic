#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void)
{
    int h;
    unsigned long prev = 0, cur = 1;
    puts("Node height (0..20):");
    if (scanf("%d", &h) != 1 || h < 0 || h > 20) {
        return 1;
    }
    if (h == 0) {
        puts("minimum=0");
        return 0;
    }
    for (int k = 2; k <= h; k++) {
        unsigned long next = 1 + cur + prev;
        prev = cur;
        cur = next;
    }
    printf("minimum=%lu\n", cur);
    return 0;
}
