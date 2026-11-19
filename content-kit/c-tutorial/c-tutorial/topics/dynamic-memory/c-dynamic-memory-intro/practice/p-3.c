#include <stdio.h>
#include <stdlib.h>

int *make_mark(int initial)
{
    int *result = malloc(sizeof *result);
    if (result != NULL) {
        *result = initial;
    }
    return result;
}

int main(void)
{
    int input;
    puts("Mark:");
    if (scanf("%d", &input) != 1 || input < 0 || input > 100) {
        return 1;
    }
    int *mark = make_mark(input);
    if (mark == NULL) {
        return 1;
    }
    printf("%d\n", *mark);
    free(mark);
    return 0;
}
