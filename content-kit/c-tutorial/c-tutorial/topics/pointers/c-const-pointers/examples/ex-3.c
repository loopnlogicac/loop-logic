#include <stdio.h>

int main(void)
{
    int score = 40;
    const int *const view = &score;
    score = 60;
    printf("%d\n", *view);
    return 0;
}
