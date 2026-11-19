#include <stdio.h>

typedef unsigned long Roll;
typedef struct Mark { Roll roll; int score; } Mark;

int main(void)
{
    Mark student = {0};
    puts("Roll and score:");
    if (scanf("%lu %d", &student.roll, &student.score) != 2 || student.roll < 1
        || student.roll > 999 || student.score < 0 || student.score > 100) {
        return 1;
    }
    printf("%lu %d\n", student.roll, student.score);
    return 0;
}
