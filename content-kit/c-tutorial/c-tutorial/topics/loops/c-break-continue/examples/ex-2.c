#include <stdio.h>

int main(void)
{
    int found = 0;
    for (int row = 1; row <= 3 && !found; row++) {
        for (int col = 1; col <= 3; col++) {
            if (row * col == 4) {
                printf("%d %d\n", row, col);
                found = 1;
                break;
            }
        }
    }
    return 0;
}
