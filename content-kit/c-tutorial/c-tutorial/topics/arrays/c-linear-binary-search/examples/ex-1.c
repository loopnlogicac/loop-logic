#include <stdio.h>

int linear(const int values[], int count, int key)
{
    for (int i = 0; i < count; i++) {
        if (values[i] == key) {
            return i;
        }
    }
    return -1;
}

int main(void)
{
    int rolls[] = {25, 11, 40, 11, 8};
    printf("%d %d\n", linear(rolls, 5, 11), linear(rolls, 5, 99));
    return 0;
}
