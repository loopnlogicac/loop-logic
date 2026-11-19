#include <stdio.h>

int main(void)
{
    int x;
    printf("Input: ");
    if (scanf("%d", &x) != 1 || x < -100 || x > 100) {
        return 1;
    }
    printf("%d\n", x >= 10 && x <= 20);
    return 0;
}
