#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int count, keep;
    puts("Count, keep, values:");
    if (scanf("%d %d", &count, &keep) != 2 || count < 1 || count > 20
        || keep < 1 || keep > count) {
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
    }
    int *next = realloc(values, (size_t)keep * sizeof *values);
    if (next == NULL) {
        free(values);
        return 1;
    }
    values = next;
    int sum = 0;
    for (int i = 0; i < keep; i++) {
        sum += values[i];
    }
    printf("%d\n", sum);
    free(values);
    return 0;
}
