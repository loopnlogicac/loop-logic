#include <stdio.h>

int main(void)
{
    int count;
    printf("Input: ");
    if (scanf("%d", &count) != 1 || count < 0 || count > 1000) {
        return 1;
    }
    int next = ++count;
    printf("%d %d\n", next, count);
    return 0;
}
