#include <stdio.h>

static int sum_marks(const int marks[], int count)
{
    int total = 0;
    for (int i = 0; i < count; ++i) {
        total += marks[i];
    }
    return total;
}

int main(void)
{
    int marks[] = {40, 60, 80};
    printf("Total: %d\n", sum_marks(marks, 3));
    marks[0] = 50;
    printf("Changed total: %d\n", sum_marks(marks, 3));
    return 0;
}
