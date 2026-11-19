#include <stdio.h>


int main(void)
{
    int n;
    int frames[10];
    int top = -1;
    long result = 1;
    puts("n (0..10):");
    if (scanf("%d", &n) != 1 || n < 0 || n > 10) {
        return 1;
    }
    while (n > 0) {
        frames[++top] = n--;
    }
    while (top >= 0) {
        result *= frames[top--];
    }
    printf("Factorial: %ld\n", result);
    return 0;
}
