#include <stdio.h>
#include <stdint.h>
#include <limits.h>

_Static_assert(CHAR_BIT == 8, "Eight-bit bytes required");

int main(void)
{
    unsigned value;
    printf("Number: ");
    if (scanf("%u", &value) != 1 || value > 65535u) {
        puts("invalid");
        return 0;
    }
    unsigned char pair[2] = {(unsigned char)(value >> 8),
                             (unsigned char)(value & 255u)};
    FILE *file = fopen("value.bin", "wb");
    if (file == NULL) {
        return 1;
    }
    int ok = fwrite(pair, 1, 2, file) == 2;
    int closed = fclose(file) == 0;
    if (!ok || !closed) {
        return 1;
    }
    file = fopen("value.bin", "rb");
    if (file == NULL) {
        return 1;
    }
    ok = fread(pair, 1, 2, file) == 2;
    closed = fclose(file) == 0;
    if (!ok || !closed) {
        return 1;
    }
    uint16_t recovered = (uint16_t)(((unsigned)pair[0] << 8) | pair[1]);
    printf("Value: %u\n", (unsigned)recovered);
    return 0;
}
