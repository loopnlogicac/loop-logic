#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>



int main(void)
{
    size_t n = 6;
    if (n > SIZE_MAX / sizeof(int)) {
        return 1;
    }
    int *values = malloc(n * sizeof *values);
    if (values == NULL) {
        return 1;
    }
    int sum = 0;
    for (size_t i = 0; i < n; i++) {
        values[i] = (int)i + 1;
        sum += values[i];
    }
    printf("%d\n", sum);
    free(values);
    return 0;
}
