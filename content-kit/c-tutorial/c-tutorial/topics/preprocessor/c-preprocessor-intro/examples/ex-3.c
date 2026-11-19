#include <stdio.h>

#define GROUP_SIZE 3

int main(void)
{
    #if GROUP_SIZE == 3
        puts("three-person group");
    #else
        puts("other group");
    #endif
    return 0;
}
