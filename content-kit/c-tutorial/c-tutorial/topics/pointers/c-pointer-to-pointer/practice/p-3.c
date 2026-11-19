#include <stdio.h>

int main(void)
{
    int a[] = {1, 2}, b[] = {3, 4, 5};
    int *rows[] = {a, b};
    size_t lengths[] = {2, 3};
    int row;
    puts("Row:");
    if (scanf("%d", &row) != 1 || row < 0 || row > 1) {
        return 1;
    }
    int **view = rows;
    int sum = 0;
    for (size_t i = 0; i < lengths[row]; i++) {
        sum += view[row][i];
    }
    printf("%d\n", sum);
    return 0;
}
