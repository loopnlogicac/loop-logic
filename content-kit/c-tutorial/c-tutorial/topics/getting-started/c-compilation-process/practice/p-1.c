#include <stdio.h>

#define BASE 10

int main(void)
{
    int value;
    printf("Input: ");
    if (scanf("%d", &value) != 1) {
        return 1;
    }
    printf("Base=%d\n", value + BASE);
    return 0;
}
