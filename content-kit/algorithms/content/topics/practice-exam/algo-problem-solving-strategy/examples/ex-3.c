#include <stdio.h>


int main(void)
{
    const int values[] = {1, 2, 4, 8};
    int prefix[5] = {0};
    for (int i = 0; i < 4; i++) {
        prefix[i + 1] = prefix[i] + values[i];
    }
    printf("Sum on [1, 3): %d\n", prefix[3] - prefix[1]);
    printf("Empty range [2, 2): %d\n", prefix[2] - prefix[2]);
    return 0;
}
