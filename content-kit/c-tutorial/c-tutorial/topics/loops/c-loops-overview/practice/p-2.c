#include <stdio.h>

int main(void)
{
    int n;
    printf("Input: ");
    if (scanf("%d", &n) != 1 || n < 0 || n > 10) {
        return 1;
    }
    while (n > 0) {
        printf("%d\n", n);
        n--;
    }
    return 0;
}
