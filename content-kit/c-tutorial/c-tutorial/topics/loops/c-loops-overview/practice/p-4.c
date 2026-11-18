#include <stdio.h>

int main(void)
{
    int n;
    printf("Input: ");
    if (scanf("%d", &n) != 1 || n < 0 || n > 100) {
        return 1;
    }
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    printf("%d\n", sum);
    return 0;
}
