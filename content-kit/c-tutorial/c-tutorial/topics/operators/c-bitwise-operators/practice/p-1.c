#include <stdio.h>

int main(void)
{
    unsigned int n;
    printf("Input: ");
    if (scanf("%u", &n) != 1 || n > 255U) {
        return 1;
    }
    printf("%u\n", n & 1U);
    return 0;
}
