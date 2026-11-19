#include <stdio.h>
#include <errno.h>

static int copy_stream(FILE *source, FILE *target, size_t *total)
{
    unsigned char block[4];
    size_t got;
    *total = 0;
    while ((got = fread(block, 1, sizeof block, source)) != 0) {
        if (fwrite(block, 1, got, target) != got) {
            return 0;
        }
        *total += got;
    }
    return !ferror(source);
}

int main(void)
{
    FILE *source = fopen("source.txt", "rb");
    if (source == NULL) {
        perror("source");
        return 1;
    }
    FILE *target = fopen("copy.bin", "wb");
    if (target == NULL) {
        int saved = errno;
        fclose(source);
        errno = saved;
        perror("target");
        return 1;
    }
    size_t total;
    int copied = copy_stream(source, target, &total);
    int copy_error = errno;
    int source_closed = fclose(source) == 0;
    int source_error = errno;
    int target_closed = fclose(target) == 0;
    int target_error = errno;
    if (!copied || !source_closed || !target_closed) {
        errno = !copied ? copy_error : (!source_closed ? source_error : target_error);
        perror("copy");
        return 1;
    }
    printf("Copied: %zu\n", total);
    return 0;
}
