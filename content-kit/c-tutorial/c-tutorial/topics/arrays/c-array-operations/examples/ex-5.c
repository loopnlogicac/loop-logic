#include <stdio.h>



int main(void)
{
    int values[] = {2, 0, 2, 4, 0, 2};
    int frequency[5] = {0};
    for (int i = 0; i < 6; i++) {
        frequency[values[i]]++;
    }
    for (int value = 0; value < 5; value++) {
        printf("%d:%d\n", value, frequency[value]);
    }
    return 0;
}
