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
    int values[] = {5, 1, 4, 2};
    int n = 4;
    insertion(values, n);
    for (int i = 0; i < n; i++) {
        printf("%s%d", i == 0 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
