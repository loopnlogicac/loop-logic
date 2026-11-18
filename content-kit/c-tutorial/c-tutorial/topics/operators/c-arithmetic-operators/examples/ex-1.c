#include <stdio.h>

int main(void)
{
    int students = 13;
    int seats = 5;
    printf("Rows=%d Left=%d\n", students / seats, students % seats);
    return 0;
}
