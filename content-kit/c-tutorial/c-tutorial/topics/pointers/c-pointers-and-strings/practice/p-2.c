#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main(void)
{
    char text[81];
    puts("Word:");
    if (scanf("%80s", text) != 1) {
        return 1;
    }
    int count = 0;
    for (const char *p = text; *p != '\0'; p++) {
        count += isalpha((unsigned char)*p) != 0;
    }
    printf("%d\n", count);
    return 0;
}
