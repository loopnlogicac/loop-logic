#include <stdio.h>

int main(void)
{
    int a, b;
    puts("Two integers (-100 to 100):");
    if (scanf("%d %d", &a, &b) != 2 || a < -100 || a > 100 || b < -100 || b > 100) {
        return 1;
    }
    int *p = &a;
    int *q = p;
    *p = b;
    printf("%d %d\n", a, *q);
    return 0;
}
