#include <stdio.h>

int main(void)
{
    int a[] = {2, 4};
    int b[] = {6};
    int *rows[] = {a, b};
    size_t lengths[] = {2, 1};
    for (size_t r = 0; r < 2; r++) {
        int total = 0;
        for (size_t c = 0; c < lengths[r]; c++) {
            total += rows[r][c];
        }
        printf("%d\n", total);
    }
    return 0;
}
