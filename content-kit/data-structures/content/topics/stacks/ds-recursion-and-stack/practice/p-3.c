#include <stdio.h>


int main(void)
{
    int n;
    int frames[1000];
    int top = -1;
    long result = 0;
    puts("n (0..1000):");
    if (scanf("%d", &n) != 1 || n < 0 || n > 1000) {
        return 1;
    }
    while (n > 0) {
        frames[++top] = n--;
    }
    while (top >= 0) {
        result += frames[top--];
    }
    printf("Sum: %ld\n", result);
    return 0;
}
