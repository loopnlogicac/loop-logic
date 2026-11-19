#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main(void)
{
    const char text[] = "A lab  room";
    int inside = 0, words = 0, vowels = 0;
    for (size_t i = 0; text[i] != '\0'; i++) {
        unsigned char ch = (unsigned char)text[i];
        int space = isspace(ch);
        if (!space && !inside) {
            words++;
        }
        inside = !space;
        int lower = tolower(ch);
        if (strchr("aeiou", lower) != NULL) {
            vowels++;
        }
    }
    printf("words=%d vowels=%d\n", words, vowels);
    return 0;
}
