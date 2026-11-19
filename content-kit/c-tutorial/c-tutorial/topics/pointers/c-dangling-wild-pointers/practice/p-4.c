#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int a, b;
    puts("Two owned values:");
    if (scanf("%d %d", &a, &b) != 2 || a < -100 || a > 100 || b < -100 || b > 100) {
        return 1;
    }
    int *owner = malloc(2 * sizeof *owner);
    if (owner == NULL) {
        return 1;
    }
    owner[0] = a;
    owner[1] = b;
    {
        const int *left = owner;
        const int *right = owner + 1;
        printf("%d\n", *left + *right);
    }
    free(owner);
    owner = NULL;
    return 0;
}
