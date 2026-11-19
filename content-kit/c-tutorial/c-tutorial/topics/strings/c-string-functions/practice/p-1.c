#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[81];
    puts("Word:");
    if (scanf("%80s", text) != 1) {
        return 1;
    }
    char *found = strchr(text, '2');
    if (found == NULL) {
        puts("-1");
    } else {
        printf("%td\n", found - text);
    }
    return 0;
}
