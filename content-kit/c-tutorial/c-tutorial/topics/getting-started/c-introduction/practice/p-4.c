#include <stdio.h>

int main(void)
{
    int money, fare;
    printf("Input: ");
    if (scanf("%d %d", &money, &fare) != 2) {
        return 1;
    }
    printf("Left = %d\n", money - fare);
    return 0;
}
