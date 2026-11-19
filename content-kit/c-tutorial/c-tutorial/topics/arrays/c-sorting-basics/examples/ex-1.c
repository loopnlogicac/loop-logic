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
    int values[] = {5, 1, 4, 2};
    int n = 4;
    bubble(values, n);
    for (int i = 0; i < n; i++) {
        printf("%s%d", i == 0 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
