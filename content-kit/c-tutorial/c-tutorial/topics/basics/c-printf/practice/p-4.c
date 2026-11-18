#include <stdio.h>

int main(void)
{
    int change;
    printf("Input: ");
    if (scanf("%d", &change) != 1) {
        return 1;
    }
    printf("Change=%+d\n", change);
    return 0;
}
