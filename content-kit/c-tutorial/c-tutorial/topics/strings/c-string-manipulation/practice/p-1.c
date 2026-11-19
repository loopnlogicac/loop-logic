#include <stdio.h>
#include <string.h>

void reverse(char text[])
{
    size_t n = strlen(text);
    for (size_t i = 0; i < n / 2; i++) {
        char temp = text[i];
        text[i] = text[n - 1 - i];
        text[n - 1 - i] = temp;
    }
}

int main(void)
{
    char text[82];
    puts("Line:");
    if (fgets(text, sizeof text, stdin) == NULL) {
        return 1;
    }
    text[strcspn(text, "\n")] = '\0';
    reverse(text);
    puts(text);
    return 0;
}
