#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[81];
    puts("Word:");
    if (scanf("%80s", text) != 1) {
        return 1;
    }
    size_t n = 0;
    while (text[n] != '\0') {
        n++;
    }
    printf("%zu\n", n);
    return 0;
}
