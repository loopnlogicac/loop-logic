#include <stdio.h>

int main(void)
{
    unsigned int active = 1, paid = 1, attempts = 5;
    unsigned int packed = active | (paid << 1) | (attempts << 2);
    printf("Packed: %u Attempts: %u\n", packed, (packed >> 2) & 7U);
    return 0;
}
