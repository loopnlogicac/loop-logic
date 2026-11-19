#include <stdio.h>

#define PASS_MARK 40

int main(void)
{
    int score = PASS_MARK + 5;
    printf("%d %d\n", score, score >= PASS_MARK);
    return 0;
}
