#include <stdio.h>

int main(void)
{
    int a = 10, b = 20, c = 30;
    int *items[] = {&c, &a, &b};
    *items[1] = 15;
    printf("%d %d %d\n", *items[0], a, *items[2]);
    return 0;
}
