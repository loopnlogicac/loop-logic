#include <stdio.h>

const int seats_per_row = 12;

int main(void)
{
    int rows;
    printf("Input: ");
    if (scanf("%d", &rows) != 1) {
        return 1;
    }
    printf("Capacity=%d\n", rows * seats_per_row);
    return 0;
}
