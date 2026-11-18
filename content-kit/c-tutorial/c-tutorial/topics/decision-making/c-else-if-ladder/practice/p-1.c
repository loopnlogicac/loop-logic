#include <stdio.h>

int main(void)
{
    int n;
    printf("Input: ");
    if (scanf("%d", &n) != 1 || n < -100 || n > 100) {
        return 1;
    }
    if (n < 0) {
        puts("Negative");
    } else if (n > 0) {
        puts("Positive");
    } else {
        puts("Zero");
    }
    return 0;
}
