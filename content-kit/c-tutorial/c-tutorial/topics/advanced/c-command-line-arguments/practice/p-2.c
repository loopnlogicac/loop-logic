#include <stdio.h>

int main(void)
{
    char text[82];
    if (fgets(text, sizeof text, stdin) == NULL) {
        puts("invalid");
        return 0;
    }
    int i = (text[0] == '+' || text[0] == '-') ? 1 : 0;
    int first = i;
    while (text[i] >= '0' && text[i] <= '9') {
        ++i;
    }
    int end = text[i] == '\0' || (text[i] == '\n' && text[i + 1] == '\0');
    puts(i > first && end ? "syntax-ok" : "invalid");
    return 0;
}
