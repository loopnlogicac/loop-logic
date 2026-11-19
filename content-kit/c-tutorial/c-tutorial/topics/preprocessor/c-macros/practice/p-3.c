#include <stdio.h>

#define STRINGIFY(x) #x

int main(void)
{
    int score;
    puts("Score:");
    if (scanf("%d", &score) != 1 || score < 0 || score > 100) {
        return 1;
    }
    printf("%s=%d\n", STRINGIFY(score), score);
    return 0;
}
