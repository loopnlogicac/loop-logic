#include <stdio.h>
#include <stdlib.h>

struct Mark { int roll; int score; };

int main(void)
{
    int count;
    puts("Record count:");
    if (scanf("%d", &count) != 1 || count < 1 || count > 20) {
        return 1;
    }
    struct Mark *owner = malloc((size_t)count * sizeof *owner);
    if (owner == NULL) {
        return 1;
    }
    int total = 0;
    for (int i = 0; i < count; i++) {
        struct Mark *current = owner + i;
        *current = (struct Mark){i + 1, (i + 1) * 2};
        total += current->score;
    }
    printf("%d\n", total);
    free(owner);
    return 0;
}
