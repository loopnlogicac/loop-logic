#include <stdio.h>

typedef unsigned long Roll;
typedef struct Mark { Roll roll; int score; } Mark;

typedef int (*ScoreRule)(const Mark *);
int passing(const Mark *student)
{
    return student->score >= 40;
}

int main(void)
{
    Mark student = {1UL, 0};
    puts("Score:");
    if (scanf("%d", &student.score) != 1 || student.score < 0 || student.score > 100) {
        return 1;
    }
    ScoreRule rule = passing;
    printf("%d\n", rule(&student));
    return 0;
}
