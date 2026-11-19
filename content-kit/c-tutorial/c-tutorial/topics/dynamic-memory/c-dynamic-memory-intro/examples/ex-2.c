#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    size_t count = 3;
    int *marks = malloc(count * sizeof *marks);
    if (marks == NULL) {
        return 1;
    }
    int total = 0;
    for (size_t i = 0; i < count; i++) {
        marks[i] = 60 + (int)i * 5;
        total += marks[i];
    }
    printf("Total: %d\n", total);
    free(marks);
    return 0;
}
