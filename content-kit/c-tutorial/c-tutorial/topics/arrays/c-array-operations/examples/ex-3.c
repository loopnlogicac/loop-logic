#include <stdio.h>



int main(void)
{
    int values[6] = {10, 20, 40, 50};
    int n = 4, position = 2;
    for (int i = n; i > position; i--) {
        values[i] = values[i - 1];
    }
    values[position] = 30;
    n++;
    for (int i = 0; i < n; i++) {
        printf("%s%d", i == 0 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
