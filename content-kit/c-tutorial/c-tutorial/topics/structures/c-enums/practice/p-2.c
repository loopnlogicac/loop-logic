#include <stdio.h>

enum Stage { STAGE_DRAFT, STAGE_REVIEW, STAGE_PUBLISHED };

int main(void)
{
    int input;
    puts("Stage:");
    if (scanf("%d", &input) != 1 || input < 0 || input > 2) {
        return 1;
    }
    enum Stage stage = (enum Stage)input;
    printf("%d\n", stage == STAGE_PUBLISHED);
    return 0;
}
