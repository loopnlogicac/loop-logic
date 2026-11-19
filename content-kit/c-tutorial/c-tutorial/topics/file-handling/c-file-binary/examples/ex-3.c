#include <stdio.h>
#include <stdint.h>
#include <limits.h>

_Static_assert(CHAR_BIT == 8, "This format requires eight-bit bytes");

static void encode(unsigned char out[2], uint16_t value)
{
    out[0] = (unsigned char)(value >> 8);
    out[1] = (unsigned char)(value & 255u);
}

static uint16_t decode(const unsigned char in[2])
{
    return (uint16_t)(((unsigned)in[0] << 8) | (unsigned)in[1]);
}

int main(void)
{
    unsigned char block[4];
    encode(block, 101);
    encode(block + 2, 8550);
    FILE *record = fopen("record.bin", "wb");
    if (record == NULL) {
        return 1;
    }
    int ok = fwrite(block, 1, sizeof block, record) == sizeof block;
    int closed = fclose(record) == 0;
    if (!ok || !closed) {
        return 1;
    }
    record = fopen("record.bin", "rb");
    if (record == NULL) {
        return 1;
    }
    ok = fread(block, 1, sizeof block, record) == sizeof block;
    closed = fclose(record) == 0;
    if (!ok || !closed) {
        return 1;
    }
    printf("Roll: %u\nMark hundredths: %u\n", (unsigned)decode(block),
           (unsigned)decode(block + 2));
    return 0;
}
