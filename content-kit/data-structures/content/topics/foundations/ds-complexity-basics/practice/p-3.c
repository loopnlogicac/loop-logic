#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int n;
    int steps = 0;
    if (scanf("%d", &n) != 1 || n < 1 || n > 1024) {
        return 1;
    }
    while (n > 1) {
        n /= 2;
        steps++;
    }
    printf("Steps: %d\n", steps);
    return 0;
}
