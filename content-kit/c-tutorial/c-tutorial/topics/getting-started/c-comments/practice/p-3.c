#include <stdio.h>

int main(void)
{
    int minutes;
    printf("Input: ");
    if (scanf("%d", &minutes) != 1) {
        return 1;
    }
    // Convert the supplied minutes into seconds.
    printf("Seconds=%d\n", minutes * 60);
    return 0;
}
