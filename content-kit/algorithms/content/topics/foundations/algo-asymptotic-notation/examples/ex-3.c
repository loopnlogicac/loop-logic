#include <stdio.h>


int main(void)
{
    int steps = 0;
    for (int remaining = 16; remaining > 1; remaining /= 2) {
        steps++;
    }
    printf("steps = %d\n", steps);
    return 0;
}
