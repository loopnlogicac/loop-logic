#include <stdio.h>

int main(void)
{
    const unsigned char values[] = {0x00, 0x41, 0xff};
    FILE *bytes = fopen("bytes.bin", "wb");
    if (bytes == NULL) {
        return 1;
    }
    int ok = fwrite(values, 1, sizeof values, bytes) == sizeof values;
    int closed = fclose(bytes) == 0;
    if (!ok || !closed) {
        return 1;
    }
    bytes = fopen("bytes.bin", "rb");
    if (bytes == NULL) {
        return 1;
    }
    unsigned char copy[3];
    ok = fread(copy, 1, sizeof copy, bytes) == sizeof copy;
    closed = fclose(bytes) == 0;
    if (!ok || !closed) {
        return 1;
    }
    printf("%02X %02X %02X\n", (unsigned)copy[0], (unsigned)copy[1],
           (unsigned)copy[2]);
    return 0;
}
