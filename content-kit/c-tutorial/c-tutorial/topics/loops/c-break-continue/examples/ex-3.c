#include <stdio.h>

int main(void)
{
    for (int row = 1; row <= 3; row++) {
        for (int col = 1; col <= 3; col++) {
            if (row + col == 4) {
                printf("%d %d\n", row, col);
                goto finished;
            }
        }
    }
    finished:
    puts("Done");
    return 0;
}
