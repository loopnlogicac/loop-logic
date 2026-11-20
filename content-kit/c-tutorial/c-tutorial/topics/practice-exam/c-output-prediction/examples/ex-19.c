#include <stdio.h>
#include <string.h>
#include <stddef.h>

int main(void)
{
    char text[] = "Dhaka";
    const char *view = text + 2;
    printf("%s\n", view);
    return 0;
}
