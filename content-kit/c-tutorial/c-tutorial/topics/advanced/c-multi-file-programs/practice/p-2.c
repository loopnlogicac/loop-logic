#include <stdio.h>
#include "range.h"

int main(void)
{
    int value;
    int low;
    int high;
    if (scanf("%d%d%d", &value, &low, &high) != 3) {
        puts("invalid");
        return 0;
    }
    puts(in_range(value, low, high) ? "inside" : "outside");
    return 0;
}
