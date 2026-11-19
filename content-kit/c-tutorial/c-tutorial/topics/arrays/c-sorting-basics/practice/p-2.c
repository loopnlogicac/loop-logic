#include <stdio.h>

void selection(int values[], int count)
{
    for (int start = 0; start < count - 1; start++) {
        int smallest = start;
        for (int i = start + 1; i < count; i++) {
            if (values[i] < values[smallest]) {
                smallest = i;
            }
        }
        int temporary = values[start];
        values[start] = values[smallest];
        values[smallest] = temporary;
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

    selection(values, n);
    for (int i = 0; i < n; i++) {
        printf("%s%d", i == 0 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
