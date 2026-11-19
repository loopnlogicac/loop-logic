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
    char result[81];
    size_t used = 0;
    int pending = 0;
    for (size_t i = 0; text[i] != '\0'; i++) {
        if (isspace((unsigned char)text[i])) {
            pending = used != 0;
        } else {
            if (pending) {
                result[used++] = ' ';
            }
            result[used++] = text[i];
            pending = 0;
        }
    }
    result[used] = '\0';
    puts(result);
    return 0;
}
