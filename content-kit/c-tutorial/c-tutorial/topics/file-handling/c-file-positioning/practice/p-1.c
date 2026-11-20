#include <stdio.h>

int main(void)
{
    int index;
    printf("Record index: ");
    if (scanf("%d", &index) != 1 || index < 0 || index >= 3) {
        puts("invalid");
        return 0;
    }
    const unsigned char data[12] = {0, 101, 0, 40, 0, 102, 0, 72,
                                   0, 103, 0, 90};
    FILE *file = fopen("rows.bin", "wb");
    if (file == NULL) {
        return 1;
    }
    int ok = fwrite(data, 1, sizeof data, file) == sizeof data;
    int closed = fclose(file) == 0;
    if (!ok || !closed) {
        return 1;
    }
    file = fopen("rows.bin", "rb");
    if (file == NULL) {
        return 1;
    }
    if (fseek(file, (long)index * 4L, SEEK_SET) != 0) {
        fclose(file);
        return 1;
    }
    unsigned char row[4];
    ok = fread(row, 1, 4, file) == 4;
    closed = fclose(file) == 0;
    if (!ok || !closed) {
        return 1;
    }
    printf("Roll: %u\nMark: %u\n", (unsigned)row[1], (unsigned)row[3]);
    return 0;
}
