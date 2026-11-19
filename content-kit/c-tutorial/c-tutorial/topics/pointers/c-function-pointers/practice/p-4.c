#include <stdio.h>

int twice(int x)
{
    return 2 * x;
}
int square(int x)
{
    return x * x;
}

int main(void)
{
    int mode, a[3];
    puts("Transform and values:");
    if (scanf("%d", &mode) != 1 || mode < 0 || mode > 1) {
        return 1;
    }
    for (size_t i = 0; i < 3; i++) {
        if (scanf("%d", &a[i]) != 1 || a[i] < -100 || a[i] > 100) {
            return 1;
        }
    }
    int (*ops[])(int) = {twice, square};
    for (size_t i = 0; i < 3; i++) {
        printf("%s%d", i == 0 ? "" : " ", ops[mode](a[i]));
    }
    putchar('\n');
    return 0;
}
