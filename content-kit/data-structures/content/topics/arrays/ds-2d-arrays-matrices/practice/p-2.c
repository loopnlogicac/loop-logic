#include <stdio.h>

int read_matrix(int matrix[3][3], int rows, int cols)
{
    for (int row = 0; row < rows; row++) {
        for (int col = 0; col < cols; col++) {
            if (scanf("%d", &matrix[row][col]) != 1
                || matrix[row][col] < -9 || matrix[row][col] > 9) {
                return 0;
            }
        }
    }
    return 1;
}

int main(void)
{
    int rows;
    int cols;
    int matrix[3][3];
    printf("Enter rows, columns and cells: ");
    if (scanf("%d%d", &rows, &cols) != 2 || rows < 1 || rows > 3
        || cols < 1 || cols > 3 || !read_matrix(matrix, rows, cols)) {
        return 1;
    }
    for (int row = 0; row < rows; row++) {
        int total = 0;
        for (int col = 0; col < cols; col++) {
            total += matrix[row][col];
        }
        printf("Row %d: %d\n", row, total);
    }
    return 0;
}
