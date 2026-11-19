#include <stdio.h>

int main(void)
{
    const char letters[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (int row = 1; row <= 4; row++) {
        for (int col = 0; col < row; col++) {
            printf("%c", letters[col]);
        }
        puts("");
    }
    return 0;
}
