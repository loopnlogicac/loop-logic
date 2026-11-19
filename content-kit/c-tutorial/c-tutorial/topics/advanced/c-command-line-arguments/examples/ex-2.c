#include <errno.h>
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
    if (argc != 2) {
        puts("Usage: parse INTEGER");
        return 1;
    }
    long value;
    if (!parse_long(argv[1], &value)) {
        puts("Invalid integer");
        return 1;
    }
    printf("Value: %ld\n", value);
    return 0;
}
