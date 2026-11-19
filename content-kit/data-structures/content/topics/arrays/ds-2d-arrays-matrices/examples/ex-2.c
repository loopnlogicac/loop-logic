#include <stdio.h>

int main(void)
{
    int a[2][2] = {{12, 24}, {36, 48}};
    int b[2][2] = {{1, 2}, {3, 4}};
    for (int row = 0; row < 2; row++) {
        for (int col = 0; col < 2; col++) {
            printf("%s%d", col == 0 ? "" : " ", a[row][col] + b[row][col]);
        }
        putchar('\n');
    }
    return 0;
}
