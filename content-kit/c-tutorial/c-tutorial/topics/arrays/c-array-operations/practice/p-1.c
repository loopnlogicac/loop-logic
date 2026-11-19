#include <stdio.h>



int main(void)
{
    int n;
    int values[10];
    puts("Count and values:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 10) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -100 || values[i] > 100) {
            return 1;
        }
    }
    int position, value;
    if (n == 10) {
        return 1;
    }
    puts("Position and value:");
    if (scanf("%d%d", &position, &value) != 2 || position < 0 || position > n ||
        value < -100 || value > 100) {
        return 1;
    }
    for (int i = n; i > position; i--) {
        values[i] = values[i - 1];
    }
    values[position] = value;
    n++;
    for (int i = 0; i < n; i++) {
        printf("%s%d", i == 0 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
