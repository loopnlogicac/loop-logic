#include <stdio.h>

struct Mark { int roll; int score; };

int main(void)
{
    struct Mark marks[] = {{4, 70}, {2, 90}, {8, 70}};
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2 - i; j++) {
            if (marks[j].score < marks[j + 1].score) {
                struct Mark temporary = marks[j];
                marks[j] = marks[j + 1];
                marks[j + 1] = temporary;
            }
        }
    }
    for (int i = 0; i < 3; i++) {
        printf("%d %d\n", marks[i].roll, marks[i].score);
    }
    return 0;
}
