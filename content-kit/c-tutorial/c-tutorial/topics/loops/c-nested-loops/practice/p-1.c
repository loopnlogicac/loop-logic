#include <stdio.h>

int main(void)
{
    int rows, columns;
    printf("Input: ");
    if (scanf("%d %d", &rows, &columns) != 2 || rows < 0 || rows > 5 || columns < 0
        || columns > 5) {
        return 1;
    }
    for (int row = 0; row < rows; row++) {
        for (int column = 0; column < columns; column++) {
            printf("*");
        }
        puts("");
    }
    return 0;
}
