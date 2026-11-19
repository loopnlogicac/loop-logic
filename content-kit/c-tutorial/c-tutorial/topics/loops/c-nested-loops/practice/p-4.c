#include <stdio.h>

int main(void)
{
    int n;
    printf("Input: ");
    if (scanf("%d", &n) != 1 || n < 0 || n > 100) {
        return 1;
    }
    int count = 0;
    for (int row = 1; row <= n; row++) {
        for (int column = 1; column <= row; column++) {
            count++;
        }
    }
    printf("%d\n", count);
    return 0;
}
