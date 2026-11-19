#include <stdio.h>

int main(void)
{
    int count, price;
    printf("Input: ");
    if (scanf("%d %d", &count, &price) != 2) {
        puts("Invalid");
        return 0;
    }
    printf("Bill=%d\n", count * price);
    return 0;
}
