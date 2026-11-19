#include <stdio.h>

int main(void)
{
    int a, b;
    printf("Input: ");
    if (scanf("%d %d", &a, &b) != 2) {
        return 1;
    }
    int saved = a;
    a = b;
    b = saved;
    printf("swapped=%d %d\n", a, b);
    return 0;
}
