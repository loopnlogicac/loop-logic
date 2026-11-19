#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int a, b;
    puts("Two values:");
    if (scanf("%d %d", &a, &b) != 2 || a < -100 || a > 100 || b < -100 || b > 100) {
        return 1;
    }
    int *left = malloc(sizeof *left);
    if (left == NULL) {
        return 1;
    }
    int *right = malloc(sizeof *right);
    if (right == NULL) {
        free(left);
        return 1;
    }
    *left = a;
    *right = b;
    printf("%d\n", *left - *right);
    free(right);
    free(left);
    return 0;
}
