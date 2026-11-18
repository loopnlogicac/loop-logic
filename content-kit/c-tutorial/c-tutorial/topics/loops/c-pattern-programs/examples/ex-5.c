#include <stdio.h>

int main(void)
{
    int n = 4;
    for (int row = 1; row <= n; row++) {
        for (int space = 0; space < n - row; space++) {
            printf(" ");
        }
        for (int star = 0; star < 2 * row - 1; star++) {
            printf("*");
        }
        puts("");
    }
    return 0;
}
