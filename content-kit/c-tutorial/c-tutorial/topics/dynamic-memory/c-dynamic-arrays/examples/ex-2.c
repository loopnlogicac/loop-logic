#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    size_t rows = 2, cols = 3;
    int **grid = malloc(rows * sizeof *grid);
    if (grid == NULL) {
        return 1;
    }
    for (size_t r = 0; r < rows; r++) {
        grid[r] = malloc(cols * sizeof *grid[r]);
        if (grid[r] == NULL) {
            for (size_t k = 0; k < r; k++) {
                free(grid[k]);
            }
            free(grid);
            return 1;
        }
        for (size_t c = 0; c < cols; c++) {
            grid[r][c] = (int)(r * 10 + c);
        }
    }
    printf("Cell: %d\n", grid[1][2]);
    for (size_t r = 0; r < rows; r++) {
        free(grid[r]);
    }
    free(grid);
    return 0;
}
