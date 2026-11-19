#include <stdio.h>

int main(void)
{
    int starting_balance, bus_fare;
    printf("Input: ");
    if (scanf("%d %d", &starting_balance, &bus_fare) != 2) {
        return 1;
    }
    printf("remaining=%d\n", starting_balance - bus_fare);
    return 0;
}
