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
    char text[] = "CSE";
    reverse(text);
    puts(text);
    return 0;
}
