#include <stdio.h>

int main(void)
{
    int n;
    printf("Input: ");
    if (scanf("%d", &n) != 1 || n < 0 || n > 5) {
        return 1;
    }
    int count = 0;
    do {
        puts("Menu");
        count++;
    } while (count < n);
    return 0;
}
