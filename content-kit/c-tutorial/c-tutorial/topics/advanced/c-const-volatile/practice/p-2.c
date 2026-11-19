#include <stdio.h>

int main(void)
{
    unsigned int status;
    if (scanf("%u", &status) != 1 || status > 255U) {
        puts("invalid");
        return 0;
    }
    const unsigned int active = 1U;
    const unsigned int ready = 1U << 2;
    printf("%d %d\n", (status & active) != 0U, (status & ready) != 0U);
    return 0;
}
