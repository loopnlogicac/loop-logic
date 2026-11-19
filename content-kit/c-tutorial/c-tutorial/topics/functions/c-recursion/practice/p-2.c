#include <stdio.h>

void countdown(int n)
{
    printf("%d\n", n);
    if (n > 0) {
        countdown(n - 1);
    }
}

int main(void)
{
    int n;
    puts("Countdown n:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 20) {
        return 1;
    }
    countdown(n);
    return 0;
}
