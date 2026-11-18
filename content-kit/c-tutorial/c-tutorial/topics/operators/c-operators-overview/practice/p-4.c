#include <stdio.h>

int main(void)
{
    int a, b, budget;
    printf("Input: ");
    if (scanf("%d %d %d", &a, &b, &budget) != 3 || a < 0 || a > 1000 || b < 0 || b > 1000
        || budget < 0 || budget > 1000) {
        return 1;
    }
    printf("%s\n", a + b <= budget ? "Ready" : "Wait");
    return 0;
}
