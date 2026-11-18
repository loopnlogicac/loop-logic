#include <stdio.h>

int main(void)
{
    int next = 1;
    for (int row = 1; row <= 4; row++) {
        for (int col = 1; col <= row; col++) {
            printf("%d%s", next, col == row ? "" : " ");
            next++;
        }
        puts("");
    }
    return 0;
}
