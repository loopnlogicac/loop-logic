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
    printf("%zu\n", strlen(text));
    return 0;
}
