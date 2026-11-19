#include <stdio.h>


int main(void)
{
    int n, composite[101] = {0};
    puts("Upper limit (0..100):");
    if (scanf("%d", &n) != 1 || n < 0 || n > 100) {
        return 1;
    }
    composite[0] = composite[1] = 1;
    for (int p = 2; p <= n / p; p++) {
        if (!composite[p]) {
            for (int multiple = p * p; multiple <= n; multiple += p) {
                composite[multiple] = 1;
            }
        }
    }
    printf("Primes:");
    for (int value = 2; value <= n; value++) {
        if (!composite[value]) {
            printf(" %d", value);
        }
    }
    puts("");
    return 0;
}
