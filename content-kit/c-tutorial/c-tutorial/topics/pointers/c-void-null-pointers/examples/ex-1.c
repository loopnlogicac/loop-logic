#include <stdio.h>

int main(void)
{
    int score = 72;
    void *generic = &score;
    int *typed = generic;
    *typed = 80;
    printf("%d\n", score);
    return 0;
}
