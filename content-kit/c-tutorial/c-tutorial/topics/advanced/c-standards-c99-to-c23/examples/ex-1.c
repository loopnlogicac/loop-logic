#include <stdio.h>

struct Mark {
    int roll;
    int score;
};

int main(void)
{
    struct Mark result = {.score = 72, .roll = 101};
    int total = 0;
    for (int i = 1; i <= 3; ++i) {
        total += i;
    }
    printf("Roll: %d; mark: %d\n", result.roll, result.score);
    printf("Total: %d\n", total);
    return 0;
}
