#include <stdio.h>

int main(void)
{
    int mark;
    printf("Marks: ");
    do {
        if (scanf("%d", &mark) != 1) {
            return 1;
        }
        if (mark < 0 || mark > 100) {
            puts("Retry");
        }
    } while (mark < 0 || mark > 100);
    printf("Accepted=%d\n", mark);
    return 0;
}
