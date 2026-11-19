#include <stdio.h>



int main(void)
{
    int n;
    int values[10];
    puts("Count and values:");
    if (scanf("%d", &n) != 1 || n < 1 || n > 10) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -100 || values[i] > 100) {
            return 1;
        }
    }
    int index, replacement;
    puts("Index and replacement:");
    if (scanf("%d%d", &index, &replacement) != 2 || index < 0 || index >= n ||
        replacement < -100 || replacement > 100) {
        return 1;
    }
    values[index] = replacement;
    for (int i = 0; i < n; i++) {
        printf("%s%d", i == 0 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
