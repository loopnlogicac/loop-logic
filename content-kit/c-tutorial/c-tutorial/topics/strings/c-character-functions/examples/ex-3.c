#include <stdio.h>
#include <ctype.h>

int main(void)
{
    char text[] = "Lab-204";
    for (size_t i = 0; text[i] != '\0'; i++) {
        putchar(toupper((unsigned char)text[i]));
    }
    putchar('\n');
    for (size_t i = 0; text[i] != '\0'; i++) {
        putchar(tolower((unsigned char)text[i]));
    }
    putchar('\n');
    return 0;
}
