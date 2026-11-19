#include <stdio.h>

int main(void)
{
    int score = 30;
    int *const p = &score;
    *p = 50;
    printf("%d\n", score);
    return 0;
}
