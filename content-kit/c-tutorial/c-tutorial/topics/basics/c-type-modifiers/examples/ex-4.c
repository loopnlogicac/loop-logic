#include <stdio.h>
#include <stdint.h>
#include <inttypes.h>

int main(void)
{
    uint8_t reading = 255;
    int32_t offset = -12;
    printf("reading=%u offset=%" PRId32 "\n", (unsigned int)reading, offset);
    return 0;
}
