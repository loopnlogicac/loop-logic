#include <stdio.h>

int main(void)
{
    int scores[2], choice;
    puts("Scores and choice:");
    if (scanf("%d %d %d", &scores[0], &scores[1], &choice) != 3 ||
        scores[0] < -100 || scores[0] > 100 || scores[1] < -100 || scores[1] > 100 ||
        choice < 0 || choice > 1) {
        return 1;
    }
    int *selected = &scores[choice];
    printf("%d\n", *selected);
    return 0;
}
