#include <stdio.h>

int main(void)
{
    int score;
    puts("Build score:");
    if (scanf("%d", &score) != 1 || score < 0 || score > 100) {
        return 1;
    }
    #if __STDC_VERSION__ >= 201710L
        printf("C17: %d\n", score);
    #else
        printf("Older: %d\n", score);
    #endif
    return 0;
}
