#include <stdio.h>

struct Mark { int roll; int score; };

int main(void)
{
    int count;
    struct Mark marks[10];
    puts("Count and roll-score pairs:");
    if (scanf("%d", &count) != 1 || count < 0 || count > 10) {
        return 1;
    }
    for (int i = 0; i < count; i++) {
        if (scanf("%d %d", &marks[i].roll, &marks[i].score) != 2
            || marks[i].roll < 1 || marks[i].roll > 999
            || marks[i].score < 0 || marks[i].score > 100) {
            return 1;
        }
    }

    int kept = 0;
    for (int i = 0; i < count; i++) {
        if (marks[i].score >= 40) {
            marks[kept++] = marks[i];
        }
    }
    printf("Passed: %d\n", kept);
    for (int i = 0; i < kept; i++) {
        printf("%d %d\n", marks[i].roll, marks[i].score);
    }
    return 0;
}
