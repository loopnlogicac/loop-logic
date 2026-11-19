#include <stdio.h>

void double_values(int values[], int count)
{
    for (int i = 0; i < count; i++) {
        values[i] *= 2;
    }
}

int main(void)
{
    int values[] = {2, 4, 6};
    int n = 3;
    double_values(values, n);
    for (int i = 0; i < n; i++) {
        printf("%s%d", i == 0 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
