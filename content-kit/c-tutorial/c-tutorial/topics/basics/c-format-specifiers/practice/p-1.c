#include <stdio.h>

int main(void)
{
    unsigned int n;
    printf("Input: ");
    if (scanf("%u", &n) != 1) {
        return 1;
    }
    printf("u=%u x=%x o=%o\n", n, n, n);
    return 0;
}
