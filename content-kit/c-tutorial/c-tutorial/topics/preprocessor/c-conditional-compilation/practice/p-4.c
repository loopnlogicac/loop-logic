#include <stdio.h>

#define FEATURE_A 1
#define FEATURE_B 0

int main(void)
{
    int value;
    puts("Base value:");
    if (scanf("%d", &value) != 1 || value < -20 || value > 20) {
        return 1;
    }
    #if FEATURE_A && !FEATURE_B
        int offset = 10;
    #else
        int offset = 0;
    #endif
    printf("%d\n", value + offset);
    return 0;
}
