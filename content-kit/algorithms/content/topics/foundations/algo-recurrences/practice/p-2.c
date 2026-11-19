#include <stdio.h>

static int calls(int n)
{
    if (n == 0) {
        return 1;
    }
    return 1 + calls(n - 1);
}

int main(void)
{
    puts("Enter n (0..64):");
    int n;
    if (scanf("%d", &n) != 1 || n < 0 || n > 64) {
        return 1;
    }
    printf("calls = %d\n", calls(n));
    return 0;
}
