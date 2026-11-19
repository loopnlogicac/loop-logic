#include <stdio.h>



int main(void)
{
    int values[] = {8, 3, 5, 9, 2};
    int n = 5;
    for (int left = 0, right = n - 1; left < right; left++, right--) {
        int temporary = values[left];
        values[left] = values[right];
        values[right] = temporary;
    }
    for (int i = 0; i < n; i++) {
        printf("%s%d", i == 0 ? "" : " ", values[i]);
    }
    putchar('\n');
    return 0;
}
