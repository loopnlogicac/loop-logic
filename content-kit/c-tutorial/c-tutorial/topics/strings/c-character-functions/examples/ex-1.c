#include <stdio.h>
#include <ctype.h>

int main(void)
{
    const char text[] = "CSE212!";
    int letters = 0, digits = 0;
    for (size_t i = 0; text[i] != '\0'; i++) {
        unsigned char ch = (unsigned char)text[i];
        letters += isalpha(ch) != 0;
        digits += isdigit(ch) != 0;
    }
    printf("letters=%d digits=%d\n", letters, digits);
    return 0;
}
