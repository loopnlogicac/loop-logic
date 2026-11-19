#include <stdio.h>

static int n, col[8], first[8], saved;
static unsigned long long solutions;
static int safe(int row, int c)
{
    for (int prev = 0; prev < row; prev++) {
        int distance = col[prev] - c;
        if (distance < 0) {
            distance = -distance;
        }
        if (col[prev] == c || distance == row - prev) {
            return 0;
        }
    }
    return 1;
}
static void search(int row)
{
    if (row == n) {
        solutions++;
        if (!saved) {
            for (int r = 0; r < n; r++) {
                first[r] = col[r];
            }
            saved = 1;
        }
        return;
    }
    for (int c = 0; c < n; c++) {
        if (safe(row, c)) {
            col[row] = c;
            search(row + 1);
            col[row] = -1;
        }
    }
}
int main(void)
{
    n = 4;
    search(0);
    for (int r = 0; r < n; r++) {
        for (int c = 0; c < n; c++) {
            printf("%c%s", first[r] == c ? 'Q' : '.', c + 1 == n ? "\n" : " ");
        }
    }
    return 0;
}
