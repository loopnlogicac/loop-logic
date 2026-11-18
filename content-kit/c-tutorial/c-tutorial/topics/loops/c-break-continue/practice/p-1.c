#include <stdio.h>

int main(void)
{
    int stop;
    printf("Input: ");
    if (scanf("%d", &stop) != 1 || stop < 1 || stop > 10) {
        return 1;
    }
    for (int i = 1; i <= 10; i++) {
        if (i == stop) {
            break;
        }
        printf("%d\n", i);
    }
    return 0;
}
