#include <stdio.h>

#define DEBUG 0

int main(void)
{
    #ifdef DEBUG
        puts("DEBUG is defined");
    #endif
    #if DEBUG
        puts("debug enabled");
    #else
        puts("debug disabled");
    #endif
    return 0;
}
