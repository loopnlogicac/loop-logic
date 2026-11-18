#include <stdio.h>

int main(void)
{
    int n;
    printf("Input: ");
    if (scanf("%d", &n) != 1 || n < 0 || n > 10) {
        return 1;
    }
    for (int i = 1; i <= n; i++) {
        printf("Roll %d\n", i);
    }
    return 0;
}
