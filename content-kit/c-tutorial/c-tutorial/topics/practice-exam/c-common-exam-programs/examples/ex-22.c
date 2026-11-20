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
    int vowels = 0;
    for (size_t i = 0; text[i] != '\0'; ++i) {
        if (strchr("aeiouAEIOU", text[i]) != NULL) {
            ++vowels;
        }
    }
    printf("%d\n", vowels);
    return 0;
}
