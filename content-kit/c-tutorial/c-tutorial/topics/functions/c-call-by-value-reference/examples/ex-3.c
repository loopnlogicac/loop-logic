#include <stdio.h>

void retarget(int *chosen, int *other)
{
    chosen = other;
    *chosen = 25;
}

int main(void)
{
    int original = 7, other = 19;
    int *chosen = &original;
    retarget(chosen, &other);
    printf("%d %d\n", *chosen, other);
    return 0;
}
