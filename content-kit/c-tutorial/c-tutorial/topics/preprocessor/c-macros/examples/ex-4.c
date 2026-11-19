#include <stdio.h>

#define BAD_SQUARE(x) x * x
#define SQUARE(x) ((x) * (x))

int main(void)
{
    int value = 3;
    printf("%d %d\n", BAD_SQUARE(value + 1), SQUARE(value + 1));
    return 0;
}
