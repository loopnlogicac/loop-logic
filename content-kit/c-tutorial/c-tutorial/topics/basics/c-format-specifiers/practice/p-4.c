#include <stdio.h>

int main(void)
{
    size_t n;
    printf("Input: ");
    if (scanf("%zu", &n) != 1) {
        return 1;
    }
    printf("Size=%zu\n", n);
    return 0;
}
