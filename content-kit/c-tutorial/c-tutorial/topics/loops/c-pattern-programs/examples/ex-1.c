#include <stdio.h>

int main(void)
{
    int n = 4;
    for (int row = 1; row <= n; row++) {
        for (int col = 1; col <= row; col++) {
            printf("*");
        }
        puts("");
    }
    return 0;
}
