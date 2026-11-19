#include <stdio.h>



int main(void)
{
    int matrix[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    int primary = 0, secondary = 0;
    for (int i = 0; i < 3; i++) {
        primary += matrix[i][i];
        secondary += matrix[i][2 - i];
    }
    printf("%d %d union=%d\n", primary, secondary, primary + secondary - matrix[1][1]);
    return 0;
}
