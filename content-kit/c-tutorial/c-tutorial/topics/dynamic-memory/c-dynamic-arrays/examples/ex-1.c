#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    size_t rows = 2, cols = 3;
    int *grid = malloc(rows * cols * sizeof *grid);
    if (grid == NULL) {
        return 1;
    }
    int total = 0;
    for (size_t r = 0; r < rows; r++) {
        for (size_t c = 0; c < cols; c++) {
            grid[r * cols + c] = (int)(r * 10 + c);
            total += grid[r * cols + c];
        }
    }
    printf("Cell: %d Total: %d\n", grid[1 * cols + 2], total);
    free(grid);
    return 0;
}
