#include <stdio.h>

#define LIMIT 20
#define SQUARE(x) ((x) * (x))

int main(void)
{
    int value = 3;
    printf("%d %d\n", LIMIT, SQUARE(value + 1));
    return 0;
}
