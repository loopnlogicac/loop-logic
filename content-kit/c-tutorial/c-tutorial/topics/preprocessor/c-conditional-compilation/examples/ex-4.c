#include <stdio.h>

#ifndef DEBUG
#define DEBUG 0
#endif

int main(void)
{
    #if DEBUG
        puts("trace: entering main");
    #endif
    puts("Result: 12");
    return 0;
}
