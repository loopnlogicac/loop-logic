#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int count;
    puts("Square count:");
    if (scanf("%d", &count) != 1 || count < 1 || count > 20) {
        return 1;
    }
    int *squares = malloc((size_t)count * sizeof *squares);
    if (squares == NULL) {
        return 1;
    }
    for (int i = 0; i < count; i++) {
        squares[i] = (i + 1) * (i + 1);
    }
    printf("%d\n", squares[count - 1]);
    free(squares);
    return 0;
}
