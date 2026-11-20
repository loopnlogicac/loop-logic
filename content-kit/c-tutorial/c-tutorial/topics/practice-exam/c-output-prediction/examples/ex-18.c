#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    char text[] = "marks";
    text[2] = '\0';
    printf("%s %zu\n", text, strlen(text));
    return 0;
}
