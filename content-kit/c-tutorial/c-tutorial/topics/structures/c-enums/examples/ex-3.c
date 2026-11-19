#include <stdio.h>

enum Stage { STAGE_DRAFT, STAGE_REVIEW, STAGE_PUBLISHED };

int main(void)
{
    enum Stage stage = STAGE_DRAFT;
    stage = STAGE_REVIEW;
    printf("%d %d\n", stage == STAGE_REVIEW, STAGE_PUBLISHED);
    return 0;
}
