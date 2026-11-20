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
    int palindrome = 1;
    for (size_t i = 0; i < length / 2; ++i) {
        if (text[i] != text[length - 1 - i]) {
            palindrome = 0;
            break;
        }
    }
    puts(palindrome ? "palindrome" : "not palindrome");
    return 0;
}
