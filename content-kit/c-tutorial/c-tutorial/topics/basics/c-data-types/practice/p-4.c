#include <stdio.h>
#include <stdbool.h>

int main(void)
{
    int value;
    printf("Input: ");
    if (scanf("%d", &value) != 1) {
        return 1;
    }
    bool ready = value;
    printf("Ready=%d\n", ready);
    return 0;
}
