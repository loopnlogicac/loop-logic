#include <errno.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>

static int parse_long(const char *text, long *result)
{
    char *end;
    errno = 0;
    long value = strtol(text, &end, 10);
    if (end == text || *end != '\0' || errno == ERANGE) {
        return 0;
    }
    *result = value;
    return 1;
}

int main(int argc, char *argv[])
{
    if (argc < 2) {
        puts("Usage: sum INTEGER...");
        return 1;
    }
    long total = 0;
    for (int i = 1; i < argc; ++i) {
        long value;
        if (!parse_long(argv[i], &value)) {
            printf("Invalid argument: %d\n", i);
            return 1;
        }
        if ((value > 0 && total > LONG_MAX - value) ||
            (value < 0 && total < LONG_MIN - value)) {
            puts("Sum out of range");
            return 1;
        }
        total += value;
    }
    printf("Sum: %ld\n", total);
    return 0;
}
