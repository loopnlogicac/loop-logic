#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *first = NULL;
    int *second = NULL;
    int status = 1;
    first = malloc(sizeof *first);
    if (first == NULL) {
        goto cleanup;
    }
    second = malloc(sizeof *second);
    if (second == NULL) {
        goto cleanup;
    }
    *first = 12;
    *second = 8;
    printf("Total=%d\n", *first + *second);
    status = 0;
    cleanup:
    free(second);
    free(first);
    return status;
}
