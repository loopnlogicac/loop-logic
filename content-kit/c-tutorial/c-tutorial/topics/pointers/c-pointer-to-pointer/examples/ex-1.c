#include <stdio.h>

int main(void)
{
    int score = 45;
    int *p = &score;
    int **pp = &p;
    **pp = 60;
    printf("%d %d\n", score, *p);
    return 0;
}
