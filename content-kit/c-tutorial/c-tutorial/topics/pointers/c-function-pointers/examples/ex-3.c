#include <stdio.h>

int twice(int value)
{
    return value * 2;
}
void apply(int *values, size_t n, int (*transform)(int))
{
    for (size_t i = 0; i < n; i++) {
        values[i] = transform(values[i]);
    }
}

int main(void)
{
    int values[] = {1, 2, 3};
    apply(values, 3, twice);
    printf("%d %d %d\n", values[0], values[1], values[2]);
    return 0;
}
