#include <stdio.h>

typedef struct { int x; int y; } Point;

int main(void)
{
    Point a, b;
    puts("Two coordinate pairs:");
    if (scanf("%d %d %d %d", &a.x, &a.y, &b.x, &b.y) != 4
        || a.x < -100 || a.x > 100 || a.y < -100 || a.y > 100
        || b.x < -100 || b.x > 100 || b.y < -100 || b.y > 100) {
        return 1;
    }
    Point sum = {a.x + b.x, a.y + b.y};
    printf("%d %d\n", sum.x, sum.y);
    return 0;
}
