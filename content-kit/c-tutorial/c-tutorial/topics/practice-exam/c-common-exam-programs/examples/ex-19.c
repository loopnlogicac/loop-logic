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
    printf("%zu\n", strlen(text));
    return 0;
}
