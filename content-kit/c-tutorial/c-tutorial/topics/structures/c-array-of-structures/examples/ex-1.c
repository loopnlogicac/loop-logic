#include <stdio.h>

struct Mark { int roll; int score; };

int main(void)
{
    struct Mark marks[] = {{4, 70}, {2, 90}, {8, 80}};
    int total = 0;
    for (size_t i = 0; i < sizeof marks / sizeof marks[0]; i++) {
        total += marks[i].score;
    }
    printf("Total: %d\n", total);
    return 0;
}
