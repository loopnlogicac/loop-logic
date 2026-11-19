#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int count, extra;
    puts("Count, values, extra:");
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
    }
    if (scanf("%d", &extra) != 1 || extra < -100 || extra > 100) {
        free(values);
        return 1;
    }
    int *next = realloc(values, ((size_t)count + 1) * sizeof *values);
    if (next == NULL) {
        free(values);
        return 1;
    }
    values = next;
    values[count] = extra;
    for (int i = 0; i <= count; i++) {
        printf("%d%c", values[i], i == count ? '\n' : ' ');
    }
    free(values);
    return 0;
}
