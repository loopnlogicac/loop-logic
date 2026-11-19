#include <stdio.h>

int main(void)
{
    int score = 5;
    const int *p = &score;
    *p = 8;
    printf("%d\n", score);
    return 0;
}
