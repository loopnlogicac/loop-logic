#include <stdio.h>



int main(void)
{
    int n;
    int values[20];
    puts("Count and values:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 20) {
        return 1;
    }
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -100 || values[i] > 100) {
            return 1;
        }
    }
    int key;
    puts("Key:");
    if (scanf("%d", &key) != 1 || key < -100 || key > 100) {
        return 1;
    }
    int position = -1;
    for (int i = 0; i < n; i++) {
        if (values[i] == key) {
            position = i;
            break;
        }
    }
    if (position >= 0) {
        for (int i = position; i < n - 1; i++) {
            values[i] = values[i + 1];
        }
        n--;
    }
    for (int i = 0; i < n; i++) {
        printf("%s%d", i == 0 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
