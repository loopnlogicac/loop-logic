#include <stdio.h>
#include <ctype.h>

int main(void)
{
    FILE *words = fopen("words.txt", "r");
    if (words == NULL) {
        return 1;
    }
    int ch;
    int previous = '\n';
    int seen = 0;
    int lines = 0;
    int count = 0;
    int inside = 0;
    while ((ch = fgetc(words)) != EOF) {
        int space = isspace((unsigned char)ch);
        if (!space && !inside) {
            count++;
        }
        inside = !space;
        lines += ch == '\n';
        previous = ch;
        seen = 1;
    }
    lines += seen && previous != '\n';
    int ok = !ferror(words);
    int closed = fclose(words) == 0;
    if (!ok || !closed) {
        return 1;
    }
    printf("Words: %d\nLogical lines: %d\n", count, lines);
    return 0;
}
