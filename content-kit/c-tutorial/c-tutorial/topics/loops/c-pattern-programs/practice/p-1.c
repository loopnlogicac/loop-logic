#include <stdio.h>

int main(void)
{
    int n;
    printf("Input: ");
    if (scanf("%d", &n) != 1 || n < 0 || n > 10) {
        return 1;
    }
    for (int row = 1; row <= n; row++) {
        for (int col = 1; col <= row; col++) {
            printf("*");
        }
        puts("");
    }
    return 0;
}
