#include <stdio.h>

int square_area(int side)
{
    return side * side;
}

int main(void)
{
    int a, b;
    puts("Sides:");
    if (scanf("%d%d", &a, &b) != 2 || a < 0 || a > 100 || b < 0 || b > 100) {
        return 1;
    }
    printf("%d %d\n", square_area(a), square_area(b));
    return 0;
}
