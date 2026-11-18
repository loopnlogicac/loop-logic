#include <stdio.h>

int main(void)
{
    int a, b;
    printf("Input: ");
    if (scanf("%d %d", &a, &b) != 2 || a < -100 || a > 100 || b < -100 || b > 100) {
        return 1;
    }
    printf("%d\n", a < b ? a : b);
    return 0;
}
