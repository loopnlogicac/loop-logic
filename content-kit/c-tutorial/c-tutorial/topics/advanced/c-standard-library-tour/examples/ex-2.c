#include <errno.h>
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    const char *text = "72x";
    char *end;
    errno = 0;
    long mark = strtol(text, &end, 10);
    int complete = end != text && *end == '\0' && errno != ERANGE;
    printf("atoi prefix: %d\n", atoi(text));
    printf("strtol prefix: %ld\n", mark);
    printf("Whole value valid: %d\n", complete);
    return 0;
}
