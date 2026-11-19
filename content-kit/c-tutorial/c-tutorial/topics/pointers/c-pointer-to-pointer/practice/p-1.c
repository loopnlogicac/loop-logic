#include <stdio.h>

void select_value(int **out, int *target)
{
    *out = target;
}

int main(void)
{
    int a, b;
    puts("Two integers (-100 to 100):");
    if (scanf("%d %d", &a, &b) != 2 || a < -100 || a > 100 || b < -100 || b > 100) {
        return 1;
    }
    int *p = NULL;
    select_value(&p, a >= b ? &a : &b);
    printf("%d\n", *p);
    return 0;
}
