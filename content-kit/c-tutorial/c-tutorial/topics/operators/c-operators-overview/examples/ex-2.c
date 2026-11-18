#include <stdio.h>

int main(void)
{
    int debt = 12;
    int cash = 50;
    printf("Signed=%d Left=%d\n", -debt, cash - debt);
    return 0;
}
