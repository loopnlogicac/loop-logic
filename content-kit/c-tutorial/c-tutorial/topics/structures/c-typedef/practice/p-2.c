#include <stdio.h>

typedef int *IntPointer;

int main(void)
{
    int a, b;
    puts("Two integers:");
    if (scanf("%d %d", &a, &b) != 2 || a < -100 || a > 100 || b < -100 || b > 100) {
        return 1;
    }
    IntPointer left = &a, right = &b;
    int saved = *left;
    *left = *right;
    *right = saved;
    printf("%d %d\n", a, b);
    return 0;
}
