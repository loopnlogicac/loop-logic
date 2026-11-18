#include <stdio.h>

int main(void)
{
    int a = 8;
    int b = 8;
    int old = a--;
    int now = --b;
    printf("%d %d %d %d\n", old, a, now, b);
    return 0;
}
