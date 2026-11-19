#include <stdio.h>

int *bad_result(void)
{
    int local = 7;
    return &local;
}

int main(void)
{
    int *p = bad_result();
    printf("%d\n", *p);
    return 0;
}
