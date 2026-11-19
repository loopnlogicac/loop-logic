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

    int target;
    puts("Target roll:");
    if (scanf("%d", &target) != 1 || target < 1 || target > 999) {
        return 1;
    }
    int found = -1;
    for (int i = 0; i < count; i++) {
        if (marks[i].roll == target) {
            found = i;
            break;
        }
    }
    if (found == -1) {
        puts("missing");
    } else {
        printf("%d\n", marks[found].score);
    }
    return 0;
}
