#include <stdio.h>

int main(void)
{
    char rooms[3][12];
    puts("Rooms:");
    for (size_t i = 0; i < 3; i++) {
        if (scanf("%11s", rooms[i]) != 1) {
            return 1;
        }
    }
    for (size_t i = 0; i < 3; i++) {
        puts(rooms[i]);
    }
    return 0;
}
