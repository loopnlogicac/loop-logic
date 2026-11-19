#include <stdio.h>

int main(void)
{
    int n;
    printf("Input: ");
    if (scanf("%d", &n) != 1 || n < 1 || n > 10) {
        return 1;
    }
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
