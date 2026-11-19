#include <stdio.h>

int increment(int *value)
{
    if (value == NULL) {
        return 0;
    }
    *value += 1;
    return 1;
}

int main(void)
{
    int value = 4;
    printf("%d\n", increment(&value));
    printf("%d %d\n", value, increment(NULL));
    return 0;
}
