#include <stdio.h>



int main(void)
{
    int a[2][2] = {{1, 2}, {3, 4}};
    int b[2][2] = {{5, 6}, {7, 8}};
    for (int row = 0; row < 2; row++) {
        for (int column = 0; column < 2; column++) {
            printf("%s%d", column == 0 ? "" : " ", a[row][column] + b[row][column]);
        }
        putchar('\n');
    }
    return 0;
}
