#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int rows, cols;
    puts("Rows and columns:");
    if (scanf("%d %d", &rows, &cols) != 2 || rows < 1 || rows > 5
        || cols < 1 || cols > 5) {
        return 1;
    }
    int *grid = malloc((size_t)rows * (size_t)cols * sizeof *grid);
    if (grid == NULL) {
        return 1;
    }
    int total = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            grid[r * cols + c] = r + c;
            total += grid[r * cols + c];
        }
    }
    printf("%d\n", total);
    free(grid);
    return 0;
}
