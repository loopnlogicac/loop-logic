#include <stdio.h>

#define DEBUG 1

int main(void)
{
    int value;
    puts("Value:");
    if (scanf("%d", &value) != 1 || value < -100 || value > 100) {
        return 1;
    }
    #if DEBUG
        puts("trace");
    #endif
    printf("%d\n", value * 2);
    return 0;
}
