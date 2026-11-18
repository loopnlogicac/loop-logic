#include <stdio.h>

int main(void)
{
    int numerator, denominator;
    printf("Input: ");
    if (scanf("%d %d", &numerator, &denominator) != 2) {
        return 1;
    }
    printf("Integer=%d\nReal=%.2f\n", numerator / denominator,
           (double)numerator / denominator);
    return 0;
}
