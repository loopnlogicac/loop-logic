#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main(void)
{
    char text[82];
    puts("Line:");
    if (fgets(text, sizeof text, stdin) == NULL) {
        return 1;
    }
    text[strcspn(text, "\n")] = '\0';
    int letters = 0, digits = 0, spaces = 0, other = 0;
    for (size_t i = 0; text[i] != '\0'; i++) {
        unsigned char ch = (unsigned char)text[i];
        if (isalpha(ch)) {
            letters++;
        } else if (isdigit(ch)) {
            digits++;
        } else if (isspace(ch)) {
            spaces++;
        } else {
            other++;
        }
    }
    printf("%d %d %d %d\n", letters, digits, spaces, other);
    return 0;
}
