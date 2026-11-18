#include <stdio.h>

int main(void)
{
    long long a, b;
    printf("Input: ");
    if (scanf("%lld %lld", &a, &b) != 2) {
        return 1;
    }
    printf("Product=%lld\n", a * b);
    return 0;
}
