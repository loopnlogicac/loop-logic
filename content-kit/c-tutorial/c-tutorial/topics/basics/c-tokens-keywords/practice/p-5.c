#include <stdio.h>

int main(void)
{
    int count, price;
    printf("Input: ");
    if (scanf("%d %d", &count, &price) != 2) {
        return 1;
    }
    int total = count * price;
    printf("count=%d\nprice=%d\ntotal=%d\n", count, price, total);
    return 0;
}
