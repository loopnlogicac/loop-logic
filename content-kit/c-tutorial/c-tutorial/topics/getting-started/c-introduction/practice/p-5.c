#include <stdio.h>

int main(void)
{
    int group_a, group_b;
    printf("Input: ");
    if (scanf("%d %d", &group_a, &group_b) != 2) {
        return 1;
    }
    int students = group_a + group_b;
    printf("Students = %d\nSeats = %d\n", students, 2 * students);
    return 0;
}
