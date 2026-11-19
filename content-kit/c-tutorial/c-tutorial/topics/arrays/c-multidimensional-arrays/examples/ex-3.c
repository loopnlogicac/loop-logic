#include <stdio.h>



int main(void)
{
    int cube[2][2][2] = {{{7}}};
    for (int layer = 0; layer < 2; layer++) {
        for (int row = 0; row < 2; row++) {
            for (int column = 0; column < 2; column++) {
                printf("%d%d%d:%d\n", layer, row, column, cube[layer][row][column]);
            }
        }
    }
    return 0;
}
