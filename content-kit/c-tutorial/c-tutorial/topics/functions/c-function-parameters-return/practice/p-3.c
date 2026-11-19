#include <stdio.h>

void split_time(int total, int *hours, int *minutes)
{
    *hours = total / 60;
    *minutes = total % 60;
}

int main(void)
{
    int total, hours, minutes;
    puts("Minutes:");
    if (scanf("%d", &total) != 1 || total < 0 || total > 10000) {
        return 1;
    }
    split_time(total, &hours, &minutes);
    printf("%d %d\n", hours, minutes);
    return 0;
}
