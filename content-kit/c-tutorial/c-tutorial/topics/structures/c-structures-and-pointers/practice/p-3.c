#include <stdio.h>

struct Mark { int roll; int score; };

int main(void)
{
    int index;
    struct Mark records[] = {{1, 10}, {2, 20}, {3, 30}};
    puts("Record index:");
    if (scanf("%d", &index) != 1 || index < 0 || index > 2) {
        return 1;
    }
    const struct Mark *view = records + index;
    printf("%d %d\n", view->roll, view->score);
    return 0;
}
