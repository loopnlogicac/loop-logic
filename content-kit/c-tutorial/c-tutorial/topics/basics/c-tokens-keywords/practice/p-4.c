#include <stdio.h>

int main(void)
{
    int a, b;
    printf("Input: ");
    if (scanf("%d %d", &a, &b) != 2) {
        return 1;
    }
    printf("result=%d\n", (a + b) * 2);
    return 0;
}
