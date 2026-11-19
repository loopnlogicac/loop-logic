#include <stdio.h>

int main(void)
{
    int matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int row;
    puts("Matrix row:");
    if (scanf("%d", &row) != 1 || row < 0 || row > 1) {
        return 1;
    }
    int (*selected)[3] = matrix + row;
    printf("%d %d %d\n", (*selected)[0], (*selected)[1], (*selected)[2]);
    return 0;
}
