#include <stdio.h>

void reverse_copy(const int *source, int *destination, size_t n)
{
    for (size_t i = 0; i < n; i++) {
        destination[i] = source[n - 1 - i];
    }
}

int main(void)
{
    int source[3], result[3];
    puts("Source values:");
    for (size_t i = 0; i < 3; i++) {
        if (scanf("%d", &source[i]) != 1 || source[i] < -100 || source[i] > 100) {
            return 1;
        }
    }
    reverse_copy(source, result, 3);
    printf("%d %d %d\n", result[0], result[1], result[2]);
    return 0;
}
