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
    int values[] = {5, 1, 4, 2};
    int n = 4;
    selection(values, n);
    for (int i = 0; i < n; i++) {
        printf("%s%d", i == 0 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
