#include <stdio.h>


int main(void)
{
    puts("Enter n (0..1000):");
    int n;
    if (scanf("%d", &n) != 1 || n < 0 || n > 1000) {
        return 1;
    }
    int steps = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            steps++;
        }
    }
    printf("steps = %d\n", steps);
    return 0;
}
