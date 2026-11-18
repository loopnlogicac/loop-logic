#include <stdio.h>

int main(void)
{
    char room[8];
    printf("Input: ");
    if (scanf("%7s", room) != 1) {
        return 1;
    }
    printf("Room=%s\n", room);
    return 0;
}
