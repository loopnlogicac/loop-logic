#include <stdio.h>
#include <stdlib.h>

int sum(const int *values, int n)
{
    if (n == 0) {
        return 0;
    }
    return values[n - 1] + sum(values, n - 1);
}

int main(void)
{
    int values[] = {12, 24, 36};
    printf("Sum: %d\n", sum(values, 3));
    printf("Empty: %d\n", sum(values, 0));
    return 0;
}
