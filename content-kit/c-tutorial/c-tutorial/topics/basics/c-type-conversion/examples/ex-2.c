#include <stdio.h>

int main(void)
{
    int total = 5;
    int count = 2;
    printf("before=%.1f after=%.1f\n", (double)total / count, (double)(total / count));
    return 0;
}
