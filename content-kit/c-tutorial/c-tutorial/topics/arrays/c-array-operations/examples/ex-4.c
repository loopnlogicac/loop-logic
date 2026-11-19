#include <stdio.h>



int main(void)
{
    int values[] = {10, 20, 30, 40};
    int n = 4, position = 1;
    for (int i = position; i < n - 1; i++) {
        values[i] = values[i + 1];
    }
    n--;
    for (int i = 0; i < n; i++) {
        printf("%s%d", i == 0 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
