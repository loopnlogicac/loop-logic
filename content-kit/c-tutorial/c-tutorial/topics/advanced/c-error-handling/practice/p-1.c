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
    char text[81];
    if (scanf("%80s", text) != 1) {
        puts("syntax");
        return 0;
    }
    int answer = -1;
    enum parse_status status = parse_mark(text, &answer);
    if (status == PARSE_OK) {
        printf("ok %d\n", answer);
    } else {
        puts(status == PARSE_SYNTAX ? "syntax" : "range");
    }
    return 0;
}
