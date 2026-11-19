#include <stdio.h>
#include <ctype.h>

int main(void)
{
    char text[] = "Lab 204";
    for (size_t i = 0; text[i] != '\0'; i++) {
        text[i] = (char)toupper((unsigned char)text[i]);
    }
    puts(text);
    return 0;
}
