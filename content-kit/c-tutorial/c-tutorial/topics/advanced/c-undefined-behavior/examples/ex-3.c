#include <stdio.h>

int main(void)
{
    int i = 4;
    int old = i;
    ++i;
    printf("Old: %d\n", old);
    printf("Current: %d\n", i);
    return 0;
}
