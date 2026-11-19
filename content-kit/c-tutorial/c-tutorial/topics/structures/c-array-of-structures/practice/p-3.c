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

    for (int i = 0; i < count - 1; i++) {
        for (int j = 0; j < count - 1 - i; j++) {
            if (marks[j].roll > marks[j + 1].roll) {
                struct Mark temporary = marks[j];
                marks[j] = marks[j + 1];
                marks[j + 1] = temporary;
            }
        }
    }
    for (int i = 0; i < count; i++) {
        printf("%d %d\n", marks[i].roll, marks[i].score);
    }
    return 0;
}
