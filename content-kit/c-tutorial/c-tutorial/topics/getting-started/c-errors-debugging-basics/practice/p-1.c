#include <stdio.h>

int main(void)
{
    int available, spent;
    printf("Input: ");
    if (scanf("%d %d", &available, &spent) != 2) {
        return 1;
    }
    printf("Left=%d\n", available - spent);
    return 0;
}
