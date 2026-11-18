#include <stdio.h>
#include <stdint.h>

int main(void)
{
    unsigned int number;
    printf("Input: ");
    if (scanf("%u", &number) != 1 || number > 255U) {
        return 1;
    }
    uint8_t byte = (uint8_t)number;
    uint8_t next = (uint8_t)(byte + 1);
    printf("Byte=%u\nNext=%u\n", (unsigned int)byte, (unsigned int)next);
    return 0;
}
