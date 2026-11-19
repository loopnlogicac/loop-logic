#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int main(void)
{
    size_t count = 5;
    int *values = NULL;
    if (count > SIZE_MAX / sizeof *values) {
        return 1;
    }
    values = malloc(count * sizeof *values);
    if (values == NULL) {
        return 1;
    }
    for (size_t i = 0; i < count; i++) {
        values[i] = (int)i + 1;
    }
    printf("Last: %d\n", values[count - 1]);
    free(values);
    return 0;
}
