#include <limits.h>
#include <stdio.h>

_Static_assert(CHAR_BIT >= 8, "This example needs at least eight bits per byte");

struct Point {
    struct {
        int x;
        int y;
    };
    int label;
};

int main(void)
{
    struct Point point = {.x = 2, .y = 3, .label = 7};
    printf("Point: %d %d; label: %d\n", point.x, point.y, point.label);
    return 0;
}
