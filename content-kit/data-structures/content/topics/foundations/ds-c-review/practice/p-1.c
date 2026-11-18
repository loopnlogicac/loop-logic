#include <stdio.h>

void increase(int *value)
{
    *value += 5;
}

int main(void)
{
    int value;
    printf("Enter value: ");
    if (scanf("%d", &value) != 1 || value < -99 || value > 99) {
        return 1;
    }
    increase(&value);
    printf("Value: %d\n", value);
    return 0;
}
