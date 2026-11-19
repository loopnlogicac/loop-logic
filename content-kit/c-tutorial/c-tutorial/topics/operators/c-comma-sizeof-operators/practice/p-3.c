#include <stdio.h>

int main(void)
{
    int n;
    printf("Input: ");
    if (scanf("%d", &n) != 1 || n < 0 || n > 100) {
        return 1;
    }
    size_t bytes = sizeof n++;
    printf("%d %d\n", n, bytes == sizeof(int));
    return 0;
}
