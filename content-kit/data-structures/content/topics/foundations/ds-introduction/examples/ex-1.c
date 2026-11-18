#include <stdio.h>
#include <stdlib.h>

void print_values(const int *values, int n)
{
    printf("Values:");
    for (int i = 0; i < n; i++) {
        printf(" %d", values[i]);
    }
    putchar('\n');
}

int main(void)
{
    int values[] = {72, 85, 64, 91};
    int total = 0;
    printf("Roll 3: %d\n", values[2]);
    values[1] = 88;
    for (int i = 0; i < 4; i++) {
        total += values[i];
    }
    print_values(values, 4);
    printf("Total: %d\n", total);
    return 0;
}
