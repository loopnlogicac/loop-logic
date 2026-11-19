#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int rows;
    puts("Rows and lengths:");
    if (scanf("%d", &rows) != 1 || rows < 1 || rows > 5) {
        return 1;
    }
    int **grid = malloc((size_t)rows * sizeof *grid);
    if (grid == NULL) {
        return 1;
    }
    int total = 0;
    for (int r = 0; r < rows; r++) {
        int length;
        if (scanf("%d", &length) != 1 || length < 1 || length > 5) {
            for (int k = 0; k < r; k++) {
                free(grid[k]);
            }
            free(grid);
            return 1;
        }
        grid[r] = malloc((size_t)length * sizeof *grid[r]);
        if (grid[r] == NULL) {
            for (int k = 0; k < r; k++) {
                free(grid[k]);
            }
            free(grid);
            return 1;
        }
        for (int c = 0; c < length; c++) {
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
