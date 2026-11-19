#include <stdio.h>

void stars(int n)
{
    if (n == 0) {
        return;
    }
    putchar('*');
    stars(n - 1);
}

void triangle(int rows)
{
    if (rows == 0) {
        return;
    }
    triangle(rows - 1);
    stars(rows);
    putchar('\n');
}

int main(void)
{
    triangle(4);
    return 0;
}
