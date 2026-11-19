#include <stdio.h>

int main(void)
{
    int n = 0;
    int digits = 0;
    do {
        digits++;
        n /= 10;
    } while (n > 0);
    printf("%d\n", digits);
    return 0;
}
