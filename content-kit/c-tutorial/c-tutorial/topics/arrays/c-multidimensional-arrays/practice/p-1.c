#include <stdio.h>



int main(void)
{
    int layers, rows, columns;
    int cube[3][3][3];
    puts("Dimensions and entries:");
    if (scanf("%d%d%d", &layers, &rows, &columns) != 3 ||
        layers < 1 || layers > 3 || rows < 1 || rows > 3 || columns < 1 || columns > 3) {
        return 1;
    }
    for (int d = 0; d < layers; d++) {
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < columns; c++) {
                if (scanf("%d", &cube[d][r][c]) != 1 || cube[d][r][c] < -100 ||
                    cube[d][r][c] > 100) {
                    return 1;
                }
            }
        }
    }
    for (int d = 0; d < layers; d++) {
        int sum = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < columns; c++) {
                sum += cube[d][r][c];
            }
        }
        printf("%d\n", sum);
    }
    return 0;
}
