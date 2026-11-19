#include <stdio.h>

struct Mark { int roll; int score; };

int main(void)
{
    struct Mark marks[] = {{4, 70}, {2, 90}, {8, 80}};
    int index = -1;
    for (int i = 0; i < 3; i++) {
        if (marks[i].roll == 2) {
            index = i;
            break;
        }
    }
    if (index >= 0) {
        printf("Found: %d %d\n", marks[index].roll, marks[index].score);
    }
    return 0;
}
