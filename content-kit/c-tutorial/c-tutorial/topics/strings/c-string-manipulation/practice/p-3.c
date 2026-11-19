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
    int inside = 0, count = 0;
    for (size_t i = 0; text[i] != '\0'; i++) {
        int space = isspace((unsigned char)text[i]);
        if (!space && !inside) {
            count++;
        }
        inside = !space;
    }
    printf("%d\n", count);
    return 0;
}
