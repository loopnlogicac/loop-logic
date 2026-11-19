#include <stdio.h>
#include <stdlib.h>



int main(void)
{
    int n;
    puts("Allocation length and values:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 20) {
        return 1;
    }
    if (n == 0) {
        puts("Empty");
        return 0;
    }
    int *values = malloc((size_t)n * sizeof *values);
    if (values == NULL) {
        return 1;
    }
    int sum = 0;
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &values[i]) != 1 || values[i] < -100 || values[i] > 100) {
            free(values);
            return 1;
        }
        sum += values[i];
    }
    printf("%d\n", sum);
    free(values);
    return 0;
}
