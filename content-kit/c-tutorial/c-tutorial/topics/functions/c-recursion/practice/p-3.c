#include <stdio.h>

int squares(int n)
{
    if (n == 0) {
        return 0;
    }
    return n * n + squares(n - 1);
}

int main(void)
{
    int n;
    puts("Squares n:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 50) {
        return 1;
    }
    printf("%d\n", squares(n));
    return 0;
}
