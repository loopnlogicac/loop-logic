#include <stdio.h>
#include <stdlib.h>


int main(void)
{
    int n, col[8], valid = 1;
    puts("Size then one column per row (size 1..8):");
    if (scanf("%d", &n) != 1 || n < 1 || n > 8) {
        return 1;
    }
    for (int r = 0; r < n; r++) {
        if (scanf("%d", &col[r]) != 1 || col[r] < 0 || col[r] >= n) {
            return 1;
        }
        for (int p = 0; p < r; p++) {
            if (col[r] == col[p] || abs(col[r] - col[p]) == r - p) {
                valid = 0;
            }
        }
    }
    puts(valid ? "Safe" : "Conflict");
    return 0;
}
