#include <stdio.h>

#define SEATS_PER_ROW 8

int main(void)
{
    const int rows = 3;
    printf("Seats = %d\n", rows * SEATS_PER_ROW);
    return 0;
}
