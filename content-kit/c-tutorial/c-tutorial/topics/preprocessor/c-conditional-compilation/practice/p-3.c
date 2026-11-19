#include <stdio.h>

#define LEVEL 2

int main(void)
{
    int value;
    puts("Base:");
    if (scanf("%d", &value) != 1 || value < 0 || value > 20) {
        return 1;
    }
    #if LEVEL == 1
        int multiplier = 2;
    #elif LEVEL == 2
        int multiplier = 3;
    #else
        int multiplier = 4;
    #endif
    printf("%d\n", value * multiplier);
    return 0;
}
