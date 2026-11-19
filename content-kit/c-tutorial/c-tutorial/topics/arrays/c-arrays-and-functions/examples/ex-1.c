#include <stdio.h>

int array_sum(const int values[], int count)
{
    int sum = 0;
    for (int i = 0; i < count; i++) {
        sum += values[i];
    }
    return sum;
}

int main(void)
{
    int values[] = {12, 15, 18};
    int count = (int)(sizeof values / sizeof values[0]);
    printf("%d\n", array_sum(values, count));
    return 0;
}
