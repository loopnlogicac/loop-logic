#include <stdio.h>

int main(void)
{
    int room;
    printf("Input: ");
    if (scanf("%d", &room) != 1 || room < 0 || room > 999) {
        return 1;
    }
    printf("%d\n", room == 201 || room == 202);
    return 0;
}
