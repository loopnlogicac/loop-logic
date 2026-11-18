#include <stdio.h>

/* Documentation: count seats for a small lab. */
const int seats_per_row = 8;

/* Definition: the result is rows multiplied by the row capacity. */
int seats_for(int rows)
{
    return rows * seats_per_row;
}

int main(void)
{
    printf("Seats = %d\n", seats_for(3));
    return 0;
}
