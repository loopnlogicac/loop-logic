#include <stdio.h>

void select_value(int **out, int *target)
{
    *out = target;
}

int main(void)
{
    int a = 10, b = 20;
    int *p = &a;
    select_value(&p, &b);
    printf("%d %d\n", a, *p);
    return 0;
}
