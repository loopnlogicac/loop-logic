#include <stdio.h>

int main(void)
{
    int total, count;
    printf("Input: ");
    if (scanf("%d %d", &total, &count) != 2 || total < 0 || total > 10000 || count < 1
        || count > 100) {
        return 1;
    }
    printf("%.2f\n", (double)total / count);
    return 0;
}
