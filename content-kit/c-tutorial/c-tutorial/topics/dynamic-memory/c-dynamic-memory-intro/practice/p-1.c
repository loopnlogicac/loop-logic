#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int count;
    puts("Count and marks:");
    if (scanf("%d", &count) != 1 || count < 0 || count > 20) {
        return 1;
    }
    if (count == 0) {
        puts("0");
        return 0;
    }
    int *marks = malloc((size_t)count * sizeof *marks);
    if (marks == NULL) {
        return 1;
    }
    int total = 0;
    for (int i = 0; i < count; i++) {
        if (scanf("%d", &marks[i]) != 1 || marks[i] < 0 || marks[i] > 100) {
            free(marks);
            return 1;
        }
        total += marks[i];
    }
    printf("%d\n", total);
    free(marks);
    return 0;
}
