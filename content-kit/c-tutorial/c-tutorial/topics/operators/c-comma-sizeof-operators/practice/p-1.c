#include <stdio.h>

int main(void)
{
    int n;
    printf("Input: ");
    if (scanf("%d", &n) != 1 || n < 0 || n > 100) {
        return 1;
    }
    int result = (++n, n * 2);
    printf("%d %d\n", result, n);
    return 0;
}
