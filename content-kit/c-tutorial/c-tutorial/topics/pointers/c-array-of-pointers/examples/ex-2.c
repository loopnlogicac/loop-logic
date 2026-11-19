#include <stdio.h>

int main(void)
{
    int matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int (*row)[3] = matrix;
    row++;
    printf("%d %d\n", (*row)[0], row[0][2]);
    return 0;
}
