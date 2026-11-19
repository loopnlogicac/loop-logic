#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>


int main(void)
{
    unsigned long key;
    puts("Unsigned key (0..1000000):");
    if (scanf("%lu", &key) != 1 || key > 1000000UL) { return 1; }
    uint32_t word = (uint32_t)((uint64_t)key * UINT64_C(2654435761));
    unsigned index = word >> 28;
    printf("bucket=%u\n", index);
    return 0;
}
