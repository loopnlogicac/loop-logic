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

    int shifts = 0;
    for (int next = 1; next < n; next++) {
        int key = values[next], position = next;
        while (position > 0 && values[position - 1] > key) {
            values[position] = values[position - 1];
            position--;
            shifts++;
        }
        values[position] = key;
    }
    printf("%d\n", shifts);
    return 0;
}
