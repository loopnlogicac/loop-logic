#include <stdio.h>

#define ROOM_SIZE 30

int main(void)
{
    #if ROOM_SIZE >= 50
        puts("large room");
    #elif ROOM_SIZE >= 20
        puts("medium room");
    #else
        puts("small room");
    #endif
    return 0;
}
