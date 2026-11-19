#include <stdio.h>

int main(void)
{
    int obtained, maximum;
    printf("Input: ");
    if (scanf("%d %d", &obtained, &maximum) != 2) {
        return 1;
    }
    printf("Percent=%.2f%%\n", (double)obtained * 100.0 / maximum);
    return 0;
}
