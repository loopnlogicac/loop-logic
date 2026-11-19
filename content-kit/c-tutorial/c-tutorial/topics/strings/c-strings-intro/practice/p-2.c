#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[81];
    puts("Word:");
    if (scanf("%80s", text) != 1) {
        return 1;
    }
    for (size_t i = 0; text[i] != '\0'; i++) {
        printf("%c\n", text[i]);
    }
    return 0;
}
