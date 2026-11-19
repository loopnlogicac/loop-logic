#include <stdio.h>

int main(void)
{
    int a, b, c;
    printf("Input: ");
    if (scanf("%d %d %d", &a, &b, &c) != 3 || a < 0 || a > 20 || b < 0 || b > 20 || c < 0
        || c > 20) {
        return 1;
    }
    printf("%d %d\n", a - b - c, a - (b - c));
    return 0;
}
