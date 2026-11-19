#include <stdio.h>

int main(void)
{
    char rooms[2][8] = {"Lab", "Office"};
    rooms[0] = rooms[1];
    puts(rooms[0]);
    return 0;
}
