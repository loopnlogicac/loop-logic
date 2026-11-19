#include <stdio.h>



int main(void)
{
    int a[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int b[3][2] = {{7, 8}, {9, 10}, {11, 12}};
    int product[2][2] = {0};
    for (int row = 0; row < 2; row++) {
        for (int column = 0; column < 2; column++) {
            for (int k = 0; k < 3; k++) {
                product[row][column] += a[row][k] * b[k][column];
            }
            printf("%s%d", column == 0 ? "" : " ", product[row][column]);
        }
        putchar('\n');
    }
    return 0;
}
