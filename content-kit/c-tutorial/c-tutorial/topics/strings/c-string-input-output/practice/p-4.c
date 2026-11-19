#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[6];
    puts("Short line:");
    if (fgets(text, sizeof text, stdin) == NULL) {
        return 1;
    }
    if (strchr(text, '\n') == NULL && strlen(text) > 4) {
        int ch;
        while ((ch = getchar()) != '\n' && ch != EOF) {
        }
        puts("REJECT");
    } else {
        text[strcspn(text, "\n")] = '\0';
        puts(text);
    }
    return 0;
}
