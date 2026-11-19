#include <stdio.h>

int main(void)
{
    int a, b;
    printf("Input: ");
    if (scanf("%d %d", &a, &b) != 2 || a < 0 || a > 100 || b < 0 || b > 100) {
        return 1;
    }
    int result = (a += 2, b = a + 3, a * b);
    printf("%d %d %d\n", result, a, b);
    return 0;
}
