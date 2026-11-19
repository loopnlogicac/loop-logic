#include <stdio.h>

int main(void)
{
    int scores[] = {40, 60, 80, 90};
    int *p = scores;
    p += 2;
    printf("%d\n", *p);
    return 0;
}
