#include <stdio.h>

int main(void)
{
    int n;
    printf("Input: ");
    if (scanf("%d", &n) != 1 || n < 1 || n > 5) {
        return 1;
    }
    for (int row = 1; row <= n; row++) {
        for (int column = 1; column <= n; column++) {
            printf("%3d", row * column);
        }
        puts("");
    }
    return 0;
}
