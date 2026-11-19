#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int rounds;
    puts("Rounds:");
    if (scanf("%d", &rounds) != 1 || rounds < 0 || rounds > 20) {
        return 1;
    }
    int total = 0;
    for (int i = 1; i <= rounds; i++) {
        int *value = malloc(sizeof *value);
        if (value == NULL) {
            return 1;
        }
        *value = i;
        total += *value;
        free(value);
    }
    printf("%d\n", total);
    return 0;
}
