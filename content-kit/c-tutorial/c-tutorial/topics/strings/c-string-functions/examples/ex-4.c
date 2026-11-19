#include <stdio.h>
#include <string.h>

int main(void)
{
    char short_name[4];
    strncpy(short_name, "Campus", sizeof short_name - 1);
    short_name[sizeof short_name - 1] = '\0';
    puts(short_name);
    return 0;
}
