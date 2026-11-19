#include <stdio.h>

int main(void)
{
    int a[] = {1, 2};
    int b[] = {3, 4, 5};
    int *rows[] = {a, b};
    int **grid = rows;
    grid[1][2] = 9;
    printf("%d %d\n", grid[0][1], b[2]);
    return 0;
}
