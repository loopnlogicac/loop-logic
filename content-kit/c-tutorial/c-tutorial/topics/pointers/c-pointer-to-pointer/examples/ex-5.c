#include <stdio.h>

int main(void)
{
    int matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int **wrong = (int **)matrix;
    printf("%d\n", wrong[1][0]);
    return 0;
}
