#include <stdio.h>

int main(void)
{
    char source[] = "CSE212";
    char copy[16];
    size_t n = 0;
    while (source[n] != '\0') {
        copy[n] = source[n];
        n++;
    }
    copy[n] = '\0';
    printf("%s %zu\n", copy, n);
    return 0;
}
