#include <stdio.h>

int main(void)
{
    int n;
    if (scanf("%d", &n) != 1 || n < 0 || n > 12) {
        puts("invalid");
        return 0;
    }
    unsigned long product = 1;
    for (int i = 2; i <= n; ++i) {
        product *= (unsigned long)i;
    }
    printf("%lu\n", product);
    return 0;
}
