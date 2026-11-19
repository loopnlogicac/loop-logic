#include <stdio.h>



int main(void)
{
    int matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int transposed[3][2];
    for (int row = 0; row < 2; row++) {
        for (int column = 0; column < 3; column++) {
            transposed[column][row] = matrix[row][column];
        }
    }
    for (int row = 0; row < 3; row++) {
        printf("%d %d\n", transposed[row][0], transposed[row][1]);
    }
    return 0;
}
