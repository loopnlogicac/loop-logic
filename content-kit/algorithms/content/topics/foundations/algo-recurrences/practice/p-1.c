#include <stdio.h>

static int leaves(int n)
{
    if (n <= 1) {
        return 1;
    }
    return leaves(n / 2) + leaves(n - n / 2);
}

int main(void)
{
    puts("Enter n (1..64):");
    int n;
    if (scanf("%d", &n) != 1 || n < 1 || n > 64) {
        return 1;
    }
    printf("leaves = %d\n", leaves(n));
    return 0;
}
