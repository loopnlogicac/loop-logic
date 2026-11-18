#include <stdio.h>

int main(void)
{
    int count;
    printf("Input: ");
    if (scanf("%d", &count) != 1 || count < 0 || count > 100) {
        return 1;
    }
    count /= 2;
    printf("%d\n", count);
    return 0;
}
