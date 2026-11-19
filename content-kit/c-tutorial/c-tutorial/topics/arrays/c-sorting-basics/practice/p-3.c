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
    for (int i = 0; i < n; i++) {
        printf("%s%d", i == 0 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
