#include <stdio.h>

int main(void)
{
    long long n;
    printf("Input: ");
    if (scanf("%lld", &n) != 1) {
        return 1;
    }
    printf("%lld\n", n);
    return 0;
}
