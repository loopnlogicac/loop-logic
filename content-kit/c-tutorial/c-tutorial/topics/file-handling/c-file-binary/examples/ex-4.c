#include <stdio.h>

int main(void)
{
    const unsigned char data[] = {0, 101, 33, 102, 0, 102, 28};
    FILE *records = fopen("partial.bin", "wb");
    if (records == NULL) {
        return 1;
    }
    int ok = fwrite(data, 1, sizeof data, records) == sizeof data;
    int closed = fclose(records) == 0;
    if (!ok || !closed) {
        return 1;
    }
    records = fopen("partial.bin", "rb");
    if (records == NULL) {
        return 1;
    }
    unsigned char block[4];
    size_t got;
    int complete = 0;
    while ((got = fread(block, 1, sizeof block, records)) == sizeof block) {
        complete++;
    }
    ok = !ferror(records);
    closed = fclose(records) == 0;
    if (!ok || !closed) {
        return 1;
    }
    printf("Complete: %d\nTrailing bytes: %zu\n", complete, got);
    return 0;
}
