#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int rows, cols;
    puts("Dimensions:");
    if (scanf("%d %d", &rows, &cols) != 2 || rows < 1 || rows > 4 || cols < 1 || cols > 4) {
        return 1;
    }
    int **grid = malloc((size_t)rows * sizeof *grid);
    if (grid == NULL) {
        return 1;
    }
    int total = 0;
    for (int r = 0; r < rows; r++) {
        grid[r] = malloc((size_t)cols * sizeof *grid[r]);
        if (grid[r] == NULL) {
            for (int k = 0; k < r; k++) {
                free(grid[k]);
            }
            free(grid);
            return 1;
        }
        for (int c = 0; c < cols; c++) {
            grid[r][c] = r + c;
            total += grid[r][c];
        }
    }
    printf("%d\n", total);
    for (int r = 0; r < rows; r++) {
        free(grid[r]);
    }
    free(grid);
    return 0;
}
