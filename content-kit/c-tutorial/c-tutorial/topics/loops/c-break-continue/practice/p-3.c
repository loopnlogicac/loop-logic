#include <stdio.h>

int main(void)
{
    int n;
    printf("Input: ");
    if (scanf("%d", &n) != 1 || n < 2 || n > 100) {
        return 1;
    }
    for (int d = 2; d <= n; d++) {
        if (n % d == 0) {
            printf("%d\n", d);
            break;
        }
    }
    return 0;
}
