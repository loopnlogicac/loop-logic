#include <stdio.h>

int main(void)
{
    int a, b, c;
    printf("Input: ");
    if (scanf("%d %d %d", &a, &b, &c) != 3 || a < 0 || a > 100 || b < 0 || b > 100 || c < 0
        || c > 100) {
        return 1;
    }
    printf("%.2f\n", (a + b + c) / 3.0);
    return 0;
}
