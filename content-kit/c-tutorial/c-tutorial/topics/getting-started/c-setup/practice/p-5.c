#include <stdio.h>

int main(void)
{
    int rows, per_row;
    printf("Input: ");
    if (scanf("%d %d", &rows, &per_row) != 2) {
        return 1;
    }
    int seats = rows * per_row;
    printf("seats=%d\nspare=%d\n", seats, seats + 1);
    return 0;
}
