#include <stdio.h>

int main(void)
{
    int students, seats;
    printf("Input: ");
    if (scanf("%d %d", &students, &seats) != 2 || students < 0 || students > 1000 || seats < 1
        || seats > 50) {
        return 1;
    }
    printf("%d %d\n", students / seats, students % seats);
    return 0;
}
