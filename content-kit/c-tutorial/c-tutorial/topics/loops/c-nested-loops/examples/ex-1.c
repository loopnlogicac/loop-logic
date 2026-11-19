#include <stdio.h>

int main(void)
{
    for (int row = 1; row <= 2; row++) {
        for (int column = 1; column <= 3; column++) {
            printf("(%d,%d) ", row, column);
        }
        puts("");
    }
    return 0;
}
