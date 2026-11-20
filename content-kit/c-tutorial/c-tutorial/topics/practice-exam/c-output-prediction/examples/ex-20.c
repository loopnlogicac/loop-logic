#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    char text[] = "abc";
    printf("%zu %zu\n", sizeof text, strlen(text));
    return 0;
}
