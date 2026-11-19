#include <stdio.h>

int main(void)
{
    int matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int transposed[3][2];
    for (int row = 0; row < 2; row++) {
        for (int col = 0; col < 3; col++) {
            transposed[col][row] = matrix[row][col];
        }
    }
    for (int row = 0; row < 3; row++) {
        printf("%d %d\n", transposed[row][0], transposed[row][1]);
    }
    return 0;
}
