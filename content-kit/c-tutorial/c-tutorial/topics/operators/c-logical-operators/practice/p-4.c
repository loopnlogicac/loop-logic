#include <stdio.h>

int main(void)
{
    int total, count;
    printf("Input: ");
    if (scanf("%d %d", &total, &count) != 2 || total < 0 || total > 100 || count < 0
        || count > 10) {
        return 1;
    }
    printf("%d\n", count != 0 && total / count > 2);
    return 0;
}
