#include <stdio.h>

int main(void)
{
    int n = 120;
    int reversed = 0;
    while (n > 0) {
        reversed = reversed * 10 + n % 10;
        n /= 10;
    }
    printf("%d\n", reversed);
    return 0;
}
