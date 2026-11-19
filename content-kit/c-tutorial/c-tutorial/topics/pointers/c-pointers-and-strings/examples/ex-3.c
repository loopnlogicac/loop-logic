#include <stdio.h>
#include <string.h>

int main(void)
{
    const char *text = "CSE212";
    size_t count = 0;
    for (const char *p = text; *p != '\0'; p++) {
        count++;
    }
    printf("%zu %zu\n", count, strlen(text + 3));
    return 0;
}
