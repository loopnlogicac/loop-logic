#include <stdio.h>

int main(void)
{
    char rooms[3][12] = {"Lab2", "Lab1", "Office"};
    rooms[0][3] = '3';
    for (size_t i = 0; i < 3; i++) {
        printf("%s\n", rooms[i]);
    }
    return 0;
}
