#include <stdio.h>

int main(void)
{
    int n = 3;
    for (int row = 1; row <= n; row++) {
        for (int space = 0; space < n - row; space++) {
            printf(" ");
        }
        for (int star = 0; star < 2 * row - 1; star++) {
            printf("*");
        }
        puts("");
    }
    for (int row = n - 1; row >= 1; row--) {
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
