#include <stdio.h>

static void swap(int *left, int *right)
{
    int saved = *left;
    *left = *right;
    *right = saved;
}

int main(void)
{
    int a;
    int b;
    if (scanf("%d%d", &a, &b) != 2) {
        puts("invalid");
        return 0;
    }
    swap(&a, &b);
    printf("%d %d\n", a, b);
    return 0;
}
