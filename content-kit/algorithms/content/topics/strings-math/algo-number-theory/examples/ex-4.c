#include <stdio.h>


int main(void)
{
    int a = 48, b = 18;
    while (b != 0) {
        printf("%d = %d * %d + %d\n", a, a / b, b, a % b);
        int remainder = a % b;
        a = b;
        b = remainder;
    }
    printf("gcd: %d\n", a);
    return 0;
}
