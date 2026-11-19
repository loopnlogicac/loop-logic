#include <stdio.h>

int main(void)
{
    int score;
    printf("Input: ");
    if (scanf("%d", &score) != 1) {
        return 1;
    }
    printf("Score = %d\n", score);
    return 0;
}
