#include <stdio.h>

struct Mark { int roll; int score; };

int main(void)
{
    struct Mark value = {0};
    int bonus;
    puts("Score and bonus:");
    if (scanf("%d %d", &value.score, &bonus) != 2 || value.score < 0 || value.score > 100
        || bonus < 0 || bonus > 20) {
        return 1;
    }
    struct Mark *view = &value;
    view->score += bonus;
    if (view->score > 100) {
        view->score = 100;
    }
    printf("%d\n", value.score);
    return 0;
}
