#include <stdio.h>

int main(void)
{
    unsigned int count;
    printf("Input: ");
    if (scanf("%u", &count) != 1) {
        return 1;
    }
    printf("Count=%u\n", count);
    return 0;
}
