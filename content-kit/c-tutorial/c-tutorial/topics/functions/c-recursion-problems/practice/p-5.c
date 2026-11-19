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
    int rows;
    puts("Rows:");
    if (scanf("%d", &rows) != 1 || rows < 0 || rows > 8) {
        return 1;
    }
    triangle(rows);
    return 0;
}
