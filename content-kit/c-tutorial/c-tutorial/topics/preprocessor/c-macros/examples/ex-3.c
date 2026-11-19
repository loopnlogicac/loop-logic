#include <stdio.h>

static inline int square(int value)
{
    return value * value;
}

int main(void)
{
    int count = 3;
    int result = square(count++);
    printf("%d %d\n", result, count);
    return 0;
}
