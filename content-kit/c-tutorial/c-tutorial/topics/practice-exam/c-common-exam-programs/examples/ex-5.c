#include <stdio.h>

int main(void)
{
    int a;
    int b;
    if (scanf("%d%d", &a, &b) != 2 || a < 0 || a > 10000 || b < 0 || b > 10000) {
        puts("invalid");
        return 0;
    }
    while (b != 0) {
        int remainder = a % b;
        a = b;
        b = remainder;
    }
    printf("%d\n", a);
    return 0;
}
