#include <stdio.h>

#define LARGE_ROOM 1

int main(void)
{
    int count;
    puts("Student count:");
    if (scanf("%d", &count) != 1 || count < 0 || count > 100) {
        return 1;
    }
    #if LARGE_ROOM
        int capacity = 60;
    #else
        int capacity = 30;
    #endif
    puts(count <= capacity ? "fits" : "full");
    return 0;
}
