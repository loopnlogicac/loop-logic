#include <stdio.h>

struct Mark { int roll; int score; };

struct Mark make_mark(int roll, int score)
{
    struct Mark result = {roll, score};
    return result;
}

int main(void)
{
    int roll, score;
    puts("Roll and score:");
    if (scanf("%d %d", &roll, &score) != 2 || roll < 1 || roll > 999
        || score < 0 || score > 100) {
        return 1;
    }
    struct Mark record = make_mark(roll, score);
    printf("%d %d\n", record.roll, record.score);
    return 0;
}
