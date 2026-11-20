#include <stdio.h>

int main(void)
{
    struct Student { int roll; int score; };
    struct Student students[3];
    for (int i = 0; i < 3; ++i) {
        if (scanf("%d%d", &students[i].roll, &students[i].score) != 2 ||
            students[i].roll < 1 || students[i].roll > 999 ||
            students[i].score < 0 || students[i].score > 100) {
            puts("invalid");
            return 0;
        }
    }
    int best = 0;
    for (int i = 1; i < 3; ++i) {
        if (students[i].score > students[best].score) {
            best = i;
        }
    }
    printf("%d %d\n", students[best].roll, students[best].score);
    return 0;
}
