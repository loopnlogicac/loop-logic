#include <stdio.h>

struct Mark {
    int roll;
    int score;
};

int main(void)
{
    int roll;
    int score;
    if (scanf("%d%d", &roll, &score) != 2 || roll < 1 || roll > 999 ||
        score < 0 || score > 100) {
        puts("invalid");
        return 0;
    }
    struct Mark result = {.score = score, .roll = roll};
    printf("%d %d\n", result.roll, result.score);
    return 0;
}
