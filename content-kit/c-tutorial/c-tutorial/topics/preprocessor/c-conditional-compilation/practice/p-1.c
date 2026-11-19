#include <stdio.h>

#ifndef ROOM_CAPACITY
#define ROOM_CAPACITY 30
#endif

int main(void)
{
    int count;
    puts("People:");
    if (scanf("%d", &count) != 1 || count < 0 || count > 100) {
        return 1;
    }
    printf("%d\n", count <= ROOM_CAPACITY);
    return 0;
}
