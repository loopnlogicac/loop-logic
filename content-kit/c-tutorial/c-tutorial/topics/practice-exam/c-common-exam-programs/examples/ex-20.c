#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[82];
    if (fgets(text, sizeof text, stdin) == NULL) {
        puts("invalid");
        return 0;
    }
    text[strcspn(text, "\n")] = '\0';
    size_t length = strlen(text);
    for (size_t i = length; i > 0; --i) {
        putchar((unsigned char)text[i - 1]);
    }
    putchar('\n');
    return 0;
}
