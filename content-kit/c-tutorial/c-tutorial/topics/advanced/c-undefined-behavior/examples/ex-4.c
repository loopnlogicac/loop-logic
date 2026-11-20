#include <limits.h>
#include <stdio.h>

int main(void)
{
    volatile int largest = INT_MAX;
    int value = largest + 1;
    printf("%d\n", value);
    return 0;
}
