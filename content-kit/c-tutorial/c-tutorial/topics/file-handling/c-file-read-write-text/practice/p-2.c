#include <stdio.h>
#include <ctype.h>

int main(void)
{
    int ch;
    int inside = 0;
    int words = 0;
    puts("Text:");
    while ((ch = fgetc(stdin)) != EOF) {
        int space = isspace((unsigned char)ch);
        if (!space && !inside) {
            words++;
        }
        inside = !space;
    }
    if (ferror(stdin)) {
        return 1;
    }
    printf("Words: %d\n", words);
    return 0;
}
