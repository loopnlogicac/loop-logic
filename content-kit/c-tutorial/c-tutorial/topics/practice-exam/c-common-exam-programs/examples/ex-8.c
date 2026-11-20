#include <stdio.h>

int main(void)
{
    long n;
    if (scanf("%ld", &n) != 1 || n < 0 || n > 999999) {
        puts("invalid");
        return 0;
    }
    long reversed = 0;
    while (n != 0) {
        reversed = reversed * 10 + n % 10;
        n /= 10;
    }
    printf("%ld\n", reversed);
    return 0;
}
