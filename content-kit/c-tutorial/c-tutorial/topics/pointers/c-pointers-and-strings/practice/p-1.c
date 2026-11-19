#include <stdio.h>
#include <string.h>

int main(void)
{
    char text[81];
    size_t k;
    puts("Word and offset:");
    if (scanf("%80s %zu", text, &k) != 2 || k > strlen(text)) {
        return 1;
    }
    puts(text + k);
    return 0;
}
