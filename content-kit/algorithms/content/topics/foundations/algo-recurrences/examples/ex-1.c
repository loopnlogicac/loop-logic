#include <stdio.h>

static int leaves(int n)
{
    if (n <= 1) {
        return 1;
    }
    return leaves(n / 2) + leaves(n - n / 2);
}

int main(void)
{
    printf("leaves = %d\n", leaves(7));
    return 0;
}
