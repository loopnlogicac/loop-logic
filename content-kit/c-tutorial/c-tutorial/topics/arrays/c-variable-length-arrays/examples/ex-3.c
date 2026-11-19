#include <stdio.h>
#if defined(__STDC_NO_VLA__) && __STDC_NO_VLA__
int total(int rows, int columns, int matrix[][4])
#else
int total(int rows, int columns, int matrix[rows][columns])
#endif
{
    int sum = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < columns; c++) {
            sum += matrix[r][c];
        }
    }
    return sum;
}
int main(void)
{
    int rows = 2, columns = 3;
#if defined(__STDC_NO_VLA__) && __STDC_NO_VLA__
    int matrix[4][4];
#else
    int matrix[rows][columns];
#endif
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < columns; c++) {
            matrix[r][c] = r * columns + c + 1;
        }
    }
    printf("%d\n", total(rows, columns, matrix));
    return 0;
}
