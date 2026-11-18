#include <stdio.h>

int main(void)
{
    int level;
    printf("Input: ");
    if (scanf("%d", &level) != 1 || level < 0 || level > 5) {
        return 1;
    }
    switch (level) {
        case 1:
        case 2:
            puts("Basic");
            break;
        default:
            puts("Other");
            break;
    }
    return 0;
}
