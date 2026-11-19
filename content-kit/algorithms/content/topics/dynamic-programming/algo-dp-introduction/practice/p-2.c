#include <stdio.h>

static int calls(int n)
{
    if (n < 2) { return 1; }
    return 1 + calls(n - 1) + calls(n - 2);
}

int main(void)
{
    int n;
    puts("Enter n:");
    if (scanf("%d", &n) != 1 || n < 0 || n > 20) { return 1; }
    printf("calls = %d\n", calls(n));
    return 0;
}
