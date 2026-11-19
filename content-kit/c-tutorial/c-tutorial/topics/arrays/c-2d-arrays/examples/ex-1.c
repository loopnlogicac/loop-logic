#include <stdio.h>



int main(void)
{
    int matrix[2][3];
    puts("Six matrix entries:");
    for (int row = 0; row < 2; row++) {
        for (int column = 0; column < 3; column++) {
            if (scanf("%d", &matrix[row][column]) != 1) {
                return 1;
            }
        }
    }
    for (int row = 0; row < 2; row++) {
        for (int column = 0; column < 3; column++) {
            printf("%s%d", column == 0 ? "" : " ", matrix[row][column]);
        }
        putchar('\n');
    }
    return 0;
}
