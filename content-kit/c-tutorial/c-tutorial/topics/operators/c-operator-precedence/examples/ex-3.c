#include <stdio.h>

int main(void)
{
    unsigned int flags = 4U;
    int ready = (flags & 4U) != 0U;
    int allowed = ready && (2 < 3 || 5 < 1);
    printf("%d %d\n", ready, allowed);
    return 0;
}
