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
    int count = 0;
    for (size_t i = 0; text[i] != '\0'; i++) {
        count += isdigit((unsigned char)text[i]) != 0;
    }
    printf("%d\n", count);
    return 0;
}
