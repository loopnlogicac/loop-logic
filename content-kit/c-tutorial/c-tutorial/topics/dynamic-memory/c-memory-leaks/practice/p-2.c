#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int count;
    puts("Count and values:");
    if (scanf("%d", &count) != 1 || count < 1 || count > 20) {
        return 1;
    }
    int *values = malloc((size_t)count * sizeof *values);
    if (values == NULL) {
        return 1;
    }
    for (int i = 0; i < count; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -100 || values[i] > 100) {
            free(values);
            return 1;
        }
        if (values[i] < 0) {
            puts("negative");
            free(values);
            return 0;
        }
    }
    puts("nonnegative");
    free(values);
    return 0;
}
