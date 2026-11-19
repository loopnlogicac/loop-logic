#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int size;
    puts("Square size:");
    if (scanf("%d", &size) != 1 || size < 1 || size > 5) {
        return 1;
    }
    int **grid = malloc((size_t)size * sizeof *grid);
    if (grid == NULL) {
        return 1;
    }
    int total = 0;
    for (int r = 0; r < size; r++) {
        grid[r] = malloc((size_t)size * sizeof *grid[r]);
        if (grid[r] == NULL) {
            for (int k = 0; k < r; k++) {
                free(grid[k]);
            }
            free(grid);
            return 1;
        }
        for (int c = 0; c < size; c++) {
            grid[r][c] = (r + 1) * (c + 1);
        }
        total += grid[r][r];
    }
    printf("%d\n", total);
    for (int r = 0; r < size; r++) {
        free(grid[r]);
    }
    free(grid);
    return 0;
}
