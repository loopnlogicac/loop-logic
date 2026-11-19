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

int main(void)
{
    char text[81];
    if (fgets(text, sizeof text, stdin) == NULL) {
        puts("invalid");
        return 0;
    }
    for (int i = 0; text[i] != '\0'; ++i) {
        if (text[i] == '\n') {
            text[i] = '\0';
            break;
        }
    }
    long value;
    if (!parse_long(text, &value) || value < 0 || value > 100) {
        puts("invalid");
        return 0;
    }
    printf("%ld\n", value);
    return 0;
}
