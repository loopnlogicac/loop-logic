#include <stdio.h>

int main(void)
{
    int n;
    printf("Byte count and values: ");
    if (scanf("%d", &n) != 1 || n < 0 || n > 12) {
        puts("invalid");
        return 0;
    }
    unsigned char data[12];
    for (int i = 0; i < n; i++) {
        int value;
        if (scanf("%d", &value) != 1 || value < 0 || value > 255) {
            puts("invalid");
            return 0;
        }
        data[i] = (unsigned char)value;
    }
    FILE *file = fopen("blocks.bin", "wb");
    if (file == NULL) {
        return 1;
    }
    int ok = fwrite(data, 1, (size_t)n, file) == (size_t)n;
    int closed = fclose(file) == 0;
    if (!ok || !closed) {
        return 1;
    }
    file = fopen("blocks.bin", "rb");
    if (file == NULL) {
        return 1;
    }
    unsigned char block[4];
    size_t got;
    int complete = 0;
    while ((got = fread(block, 1, 4, file)) == 4) {
        complete++;
    }
    ok = !ferror(file);
    closed = fclose(file) == 0;
    if (!ok || !closed) {
        return 1;
    }
    printf("Complete: %d\nTrailing: %zu\n", complete, got);
    return 0;
}
