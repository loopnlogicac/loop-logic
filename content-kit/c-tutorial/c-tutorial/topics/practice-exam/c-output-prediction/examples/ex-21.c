#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    char text[] = "abcd";
    memmove(text + 1, text, 3);
    printf("%s\n", text);
    return 0;
}
