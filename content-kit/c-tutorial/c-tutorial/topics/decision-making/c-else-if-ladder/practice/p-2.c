#include <stdio.h>

int main(void)
{
    int n;
    printf("Input: ");
    if (scanf("%d", &n) != 1 || n < 0 || n > 100) {
        return 1;
    }
    if (n <= 20) {
        puts("Small");
    } else if (n <= 40) {
        puts("Medium");
    } else {
        puts("Large");
    }
    return 0;
}
