#include <stdio.h>
#include <limits.h>

_Static_assert(CHAR_BIT == 8, "Record offsets require eight-bit bytes");

static unsigned decode(const unsigned char *pair)
{
    return ((unsigned)pair[0] << 8) | pair[1];
}

int main(void)
{
    const unsigned char data[12] = {0, 101, 33, 102, 0, 102, 28, 32,
                                   0, 103, 35, 40};
    FILE *records = fopen("records.bin", "wb");
    if (records == NULL) {
        return 1;
    }
    int ok = fwrite(data, 1, sizeof data, records) == sizeof data;
    int closed = fclose(records) == 0;
    if (!ok || !closed) {
        return 1;
    }
    records = fopen("records.bin", "rb+");
    if (records == NULL) {
        return 1;
    }
    const unsigned char mark[2] = {33, 52};
    if (fseek(records, 6L, SEEK_SET) != 0
            || fwrite(mark, 1, 2, records) != 2
            || fseek(records, 4L, SEEK_SET) != 0) {
        fclose(records);
        return 1;
    }
    unsigned char block[4];
    ok = fread(block, 1, sizeof block, records) == sizeof block;
    closed = fclose(records) == 0;
    if (!ok || !closed) {
        return 1;
    }
    printf("Roll: %u\nMark hundredths: %u\n", decode(block), decode(block + 2));
    return 0;
}
