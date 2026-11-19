#include <stdio.h>

void trace(int n)
{
    printf("enter %d\n", n);
    if (n > 0) {
        trace(n - 1);
    }
    printf("leave %d\n", n);
}

int main(void)
{
    trace(3);
    return 0;
}
