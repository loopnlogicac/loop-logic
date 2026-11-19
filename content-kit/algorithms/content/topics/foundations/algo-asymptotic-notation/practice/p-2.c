#include <stdio.h>


int main(void)
{
    puts("Enter n (1..1000000):");
    int n;
    if (scanf("%d", &n) != 1 || n < 1 || n > 1000000) {
        return 1;
    }
    int steps = 0;
    while (n > 1) {
        n /= 2;
        steps++;
    }
    printf("steps = %d\n", steps);
    return 0;
}
