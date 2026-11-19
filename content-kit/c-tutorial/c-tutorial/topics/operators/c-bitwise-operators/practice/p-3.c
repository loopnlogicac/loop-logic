#include <stdio.h>

int main(void)
{
    unsigned int flags;
    printf("Input: ");
    if (scanf("%u", &flags) != 1 || flags > 15U) {
        return 1;
    }
    flags &= ~(1U << 1);
    printf("%u\n", flags);
    return 0;
}
