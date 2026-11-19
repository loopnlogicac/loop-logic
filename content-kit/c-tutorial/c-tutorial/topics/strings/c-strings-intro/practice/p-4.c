#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[81];
    puts("Word:");
    if (scanf("%80s", text) != 1) {
        return 1;
    }
    char result[81];
    size_t used = 0;
    for (size_t i = 0; text[i] != '\0'; i++) {
        if (i % 2 == 0) {
            result[used++] = text[i];
        }
    }
    result[used] = '\0';
    puts(result);
    return 0;
}
