#include <stdio.h>

int main(void)
{
    int n;
    if (scanf("%d", &n) != 1 || n < 0 || n > 1000) {
        puts("invalid");
        return 0;
    }
    long total = (long)n * (n + 1) / 2;
    printf("%ld\n", total);
    return 0;
}
