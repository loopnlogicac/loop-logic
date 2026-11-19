#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[81];
    puts("Word:");
    if (scanf("%80s", text) != 1) {
        return 1;
    }
    const char *part = strchr(text, '-');
    if (part == NULL) {
        puts("MISSING");
    } else {
        puts(part + 1);
    }
    return 0;
}
