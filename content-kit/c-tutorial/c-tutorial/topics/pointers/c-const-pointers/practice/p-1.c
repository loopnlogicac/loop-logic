#include <stdio.h>

int larger(const int *a, const int *b)
{
    return *a >= *b ? *a : *b;
}

int main(void)
{
    int a, b;
    puts("Two integers (-100 to 100):");
    if (scanf("%d %d", &a, &b) != 2 || a < -100 || a > 100 || b < -100 || b > 100) {
        return 1;
    }
    printf("%d\n", larger(&a, &b));
    return 0;
}
