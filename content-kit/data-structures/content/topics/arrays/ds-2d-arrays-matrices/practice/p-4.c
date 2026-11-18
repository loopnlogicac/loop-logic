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
    int a[3][3];
    int b[3][3];
    printf("Enter two 2x2 matrices: ");
    if (!read_matrix(a, 2, 2) || !read_matrix(b, 2, 2)) {
        return 1;
    }
    for (int row = 0; row < 2; row++) {
        for (int col = 0; col < 2; col++) {
            int total = 0;
            for (int k = 0; k < 2; k++) {
                total += a[row][k] * b[k][col];
            }
            printf("%s%d", col == 0 ? "" : " ", total);
        }
        putchar('\n');
    }
    return 0;
}
