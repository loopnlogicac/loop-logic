#include <stdio.h>

int main(void)
{
    int n = 5;
    for (int row = 0; row < n; row++) {
        unsigned long long value = 1;
        for (int col = 0; col <= row; col++) {
            if (col > 0) {
                printf(" ");
            }
            printf("%llu", value);
            if (col < row) {
                value = value * (unsigned long long)(row - col) / (unsigned long long)(col + 1);
            }
        }
        puts("");
    }
    return 0;
}
