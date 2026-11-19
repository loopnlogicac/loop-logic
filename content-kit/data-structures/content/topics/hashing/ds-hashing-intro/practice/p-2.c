#include <stdio.h>
#include <stdlib.h>

static unsigned hash_text(const char *text)
{
    unsigned h = 0;
    for (const unsigned char *p = (const unsigned char *)text; *p != 0; p++) {
        h = (h * 31U + *p) % 101U;
    }
    return h;
}

int main(void)
{
    char text[25];
    puts("Word (1..24 non-space characters):");
    if (scanf("%24s", text) != 1) { return 1; }
    printf("hash=%u\n", hash_text(text));
    return 0;
}
