#include <stdio.h>

int main(void)
{
    int n = 1221;
    int original = n;
    int reversed = 0;
    do {
        reversed = reversed * 10 + n % 10;
        n /= 10;
    } while (n > 0);
    printf("%d\n", original == reversed);
    return 0;
}
