#include <stdio.h>

int main(void)
{
    int a, b;
    printf("Input: ");
    if (scanf("%d %d", &a, &b) != 2) {
        return 1;
    }
    int total = a + b;
    printf("Total=%d\n", total);
    return 0;
}
