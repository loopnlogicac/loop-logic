#include <stdio.h>



int main(void)
{
    int rows, columns;
    int a[4][4];
    puts("Shape and entries:");
    if (scanf("%d%d", &rows, &columns) != 2 || rows < 1 || rows > 4 ||
        columns < 1 || columns > 4) {
        return 1;
    }
    for (int row = 0; row < rows; row++) {
        for (int column = 0; column < columns; column++) {
            if (scanf("%d", &a[row][column]) != 1 ||
                a[row][column] < -10 || a[row][column] > 10) {
                return 1;
            }
        }
    }
    if (rows != columns) {
        return 1;
    }
    int sum = 0;
    for (int i = 0; i < rows; i++) {
        sum += a[i][i];
        if (i != rows - 1 - i) {
            sum += a[i][rows - 1 - i];
        }
    }
    printf("%d\n", sum);
    return 0;
}
