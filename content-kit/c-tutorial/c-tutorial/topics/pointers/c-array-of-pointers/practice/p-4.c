#include <stdio.h>

int main(void)
{
    int a[] = {2, 4}, b[] = {6};
    int *rows[] = {a, b};
    size_t lengths[] = {2, 1};
    int row;
    size_t count;
    puts("Jagged row and count:");
    if (scanf("%d %zu", &row, &count) != 2 || row < 0 || row > 1 ||
        count > lengths[row]) {
        return 1;
    }
    int sum = 0;
    for (size_t i = 0; i < count; i++) {
        sum += rows[row][i];
    }
    printf("%d\n", sum);
    return 0;
}
