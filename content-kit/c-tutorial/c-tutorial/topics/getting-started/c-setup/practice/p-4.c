#include <stdio.h>

int main(void)
{
    int value;
    printf("Input: ");
    if (scanf("%d", &value) != 1) {
        return 1;
    }
    printf("Start\nn=%d\n", value);
    return 0;
}
