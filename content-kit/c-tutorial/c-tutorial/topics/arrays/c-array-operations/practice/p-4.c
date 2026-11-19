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
        if (scanf("%d", &values[i]) != 1 || values[i] < 0 || values[i] > 9) {
            return 1;
        }
    }

    if (n == 0) {
        puts("Empty");
    } else {
        int frequency[10] = {0};
        for (int i = 0; i < n; i++) {
            frequency[values[i]]++;
        }
        int best = 0;
        for (int value = 1; value < 10; value++) {
            if (frequency[value] > frequency[best]) {
                best = value;
            }
        }
        printf("%d %d\n", best, frequency[best]);
    }
    return 0;
}
