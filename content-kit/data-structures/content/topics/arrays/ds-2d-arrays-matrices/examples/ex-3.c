#include <stdio.h>

int main(void)
{
    int matrix[2][3] = {{0, 7, 0}, {9, 0, 5}};
    int count = 0;
    for (int row = 0; row < 2; row++) {
        for (int col = 0; col < 3; col++) {
            if (matrix[row][col] != 0) {
                count++;
            }
        }
    }
    printf("rows=2 cols=3 terms=%d\n", count);
    for (int row = 0; row < 2; row++) {
        for (int col = 0; col < 3; col++) {
            if (matrix[row][col] != 0) {
                printf("%d %d %d\n", row, col, matrix[row][col]);
            }
        }
    }
    return 0;
}
