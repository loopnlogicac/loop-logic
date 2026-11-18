#include <stdio.h>

int main(void)
{
    int n;
    printf("Input: ");
    if (scanf("%d", &n) != 1 || n < 0 || n > 999999) {
        return 1;
    }
    int digits = 0;
    do {
        digits++;
        n /= 10;
    } while (n > 0);
    printf("%d\n", digits);
    return 0;
}
