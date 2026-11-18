#include <stdio.h>

int main(void)
{
    int n;
    printf("Input: ");
    if (scanf("%d", &n) != 1 || n < 0 || n > 999999) {
        return 1;
    }
    int reversed = 0;
    while (n > 0) {
        reversed = reversed * 10 + n % 10;
        n /= 10;
    }
    printf("%d\n", reversed);
    return 0;
}
