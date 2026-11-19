#include <stdio.h>

int matrix_sum(int matrix[][3], int rows)
{
    int sum = 0;
    for (int row = 0; row < rows; row++) {
        for (int column = 0; column < 3; column++) {
            sum += matrix[row][column];
        }
    }
    return sum;
}

int main(void)
{
    int matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};
    printf("%d\n", matrix_sum(matrix, 2));
    return 0;
}
