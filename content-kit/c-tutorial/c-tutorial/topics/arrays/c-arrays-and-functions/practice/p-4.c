#include <stdio.h>

void print_totals(int matrix[][3], int rows)
{
    for (int r = 0; r < rows; r++) {
        int sum = 0;
        for (int c = 0; c < 3; c++) {
            sum += matrix[r][c];
        }
        printf("%d\n", sum);
    }
}

int main(void)
{
    int matrix[2][3];
    puts("Matrix entries:");
    for (int r = 0; r < 2; r++) {
        for (int c = 0; c < 3; c++) {
            if (scanf("%d", &matrix[r][c]) != 1 ||
                matrix[r][c] < -100 || matrix[r][c] > 100) {
                return 1;
            }
        }
    }
    print_totals(matrix, 2);
    return 0;
}
