#include <stdio.h>

void bubble(int values[], int count)
{
    for (int end = count - 1; end > 0; end--) {
        int changed = 0;
        for (int i = 0; i < end; i++) {
            if (values[i] > values[i + 1]) {
                int temporary = values[i];
                values[i] = values[i + 1];
                values[i + 1] = temporary;
                changed = 1;
            }
        }
        if (!changed) {
            break;
        }
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

    bubble(values, n);
    for (int i = 0; i < n; i++) {
        printf("%s%d", i == 0 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
