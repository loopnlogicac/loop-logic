#include <stdio.h>

int main(void)
{
    int a, b;
    printf("Input: ");
    if (scanf("%d %d", &a, &b) != 2 || a < 0 || a > 9999 || b < 0 || b > 9999) {
        return 1;
    }
    printf("%d\n", a != b);
    return 0;
}
