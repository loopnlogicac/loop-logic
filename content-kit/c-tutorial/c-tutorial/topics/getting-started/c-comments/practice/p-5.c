#include <stdio.h>

/** Return seats for 0 to 100 rows, with eight seats per row. */
int capacity(int rows)
{
    return 8 * rows;
}

int main(void)
{
    int rows;
    printf("Input: ");
    if (scanf("%d", &rows) != 1) {
        return 1;
    }
    int seats = capacity(rows);
    printf("Seats=%d\nSpare=%d\n", seats, seats + 2);
    return 0;
}
