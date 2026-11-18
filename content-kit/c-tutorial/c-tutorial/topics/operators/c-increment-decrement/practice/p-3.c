#include <stdio.h>

int main(void)
{
    int seats;
    printf("Input: ");
    if (scanf("%d", &seats) != 1 || seats < 1 || seats > 1000) {
        return 1;
    }
    int before = seats--;
    printf("%d %d\n", before, seats);
    return 0;
}
