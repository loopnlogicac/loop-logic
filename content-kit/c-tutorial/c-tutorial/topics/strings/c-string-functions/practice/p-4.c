#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[81];
    puts("Word:");
    if (scanf("%80s", text) != 1) {
        return 1;
    }
    size_t count = 0;
    const char *cursor = text;
    while ((cursor = strstr(cursor, "aa")) != NULL) {
        count++;
        cursor++;
    }
    printf("%zu\n", count);
    return 0;
}
