#include <stdio.h>

enum Stage { STAGE_DRAFT, STAGE_REVIEW, STAGE_PUBLISHED };

int main(void)
{
    int state, action;
    puts("State and action:");
    if (scanf("%d %d", &state, &action) != 2 || state < 0 || state > 2
        || action < 0 || action > 1) {
        return 1;
    }
    enum Stage stage = (enum Stage)state;
    if (action == 1 && stage != STAGE_PUBLISHED) {
        stage = (enum Stage)(stage + 1);
    }
    printf("%d\n", (int)stage);
    return 0;
}
