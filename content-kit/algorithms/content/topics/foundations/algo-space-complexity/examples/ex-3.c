#include <stdio.h>

static int depth(int n)
{
    if (n <= 1) {
        return 1;
    }
    return 1 + depth(n / 2);
}

int main(void)
{
    printf("depth = %d\n", depth(8));
    return 0;
}
