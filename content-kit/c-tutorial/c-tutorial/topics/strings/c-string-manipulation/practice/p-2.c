#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[82];
    puts("Line:");
    if (fgets(text, sizeof text, stdin) == NULL) {
        return 1;
    }
    text[strcspn(text, "\n")] = '\0';
    size_t n = strlen(text);
    int equal = 1;
    for (size_t i = 0; i < n / 2; i++) {
        if (text[i] != text[n - 1 - i]) {
            equal = 0;
        }
    }
    puts(equal ? "YES" : "NO");
    return 0;
}
