#include <errno.h>
#include <stdio.h>
#include <stdlib.h>

enum parse_status { PARSE_OK, PARSE_SYNTAX, PARSE_RANGE };

static enum parse_status parse_mark(const char *text, int *answer)
{
    char *end;
    errno = 0;
    long value = strtol(text, &end, 10);
    if (end == text || *end != '\0') {
        return PARSE_SYNTAX;
    }
    if (errno == ERANGE || value < 0 || value > 100) {
        return PARSE_RANGE;
    }
    *answer = (int)value;
    return PARSE_OK;
}

int main(void)
{
    const char *inputs[] = {"0", "72x", "101"};
    for (int i = 0; i < 3; ++i) {
        int mark = -1;
        enum parse_status status = parse_mark(inputs[i], &mark);
        if (status == PARSE_OK) {
            printf("ok: %d\n", mark);
        } else if (status == PARSE_SYNTAX) {
            puts("invalid syntax");
        } else {
            puts("outside mark range");
        }
    }
    return 0;
}
