#include <stdio.h>

int main(void)
{
    int first, second;
    printf("Input: ");
    if (scanf("%d %d", &first, &second) != 2) {
        return 1;
    }
    printf("First: %d\nSecond: %d\nTotal: %d\n", first, second, first + second);
    return 0;
}
