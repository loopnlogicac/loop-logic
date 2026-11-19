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
    for (char *p = text; *p != '\0'; p++) {
        if (isdigit((unsigned char)*p)) {
            *p = '#';
        }
    }
    puts(text);
    return 0;
}
