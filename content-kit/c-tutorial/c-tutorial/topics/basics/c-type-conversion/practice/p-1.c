#include <stdio.h>

int main(void)
{
    int a, b;
    printf("Input: ");
    if (scanf("%d %d", &a, &b) != 2) {
        return 1;
    }
    printf("Average=%.1f\n", (double)(a + b) / 2);
    return 0;
}
