#include <stdio.h>

int main(void)
{
    int a, b;
    puts("Two integers (-100 to 100):");
    if (scanf("%d %d", &a, &b) != 2 || a < -100 || a > 100 || b < -100 || b > 100) {
        return 1;
    }
    const int *view = &a;
    int *writer = &a;
    *writer = b;
    printf("%d\n", *view);
    return 0;
}
