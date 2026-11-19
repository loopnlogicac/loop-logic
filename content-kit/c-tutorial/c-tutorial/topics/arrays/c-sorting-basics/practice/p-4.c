#include <stdio.h>

void insertion(int values[], int count)
{
    for (int next = 1; next < count; next++) {
        int key = values[next];
        int position = next;
        while (position > 0 && values[position - 1] > key) {
            values[position] = values[position - 1];
            position--;
        }
        values[position] = key;
    }
}

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

    insertion(values, n);
    int printed = 0;
    for (int i = 0; i < n; i++) {
        if (i == 0 || values[i] != values[i - 1]) {
            printf("%s%d", printed ? " " : "", values[i]);
            printed = 1;
        }
    }
    putchar('\n');
    return 0;
}
