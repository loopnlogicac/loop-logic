#include <stdio.h>

int main(void)
{
    int visits = 0;
    for (int row = 1; row <= 4; row++) {
        for (int column = 1; column <= row; column++) {
            visits++;
        }
    }
    printf("%d\n", visits);
    return 0;
}
