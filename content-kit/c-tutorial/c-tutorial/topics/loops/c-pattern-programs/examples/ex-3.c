#include <stdio.h>

int main(void)
{
    for (int row = 1; row <= 4; row++) {
        for (int col = 1; col <= row; col++) {
            printf("%d", col);
        }
        puts("");
    }
    return 0;
}
