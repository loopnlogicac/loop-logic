#include <stdio.h>

int main(void)
{
    int ready;
    printf("Input: ");
    if (scanf("%d", &ready) != 1 || ready < 0 || ready > 1) {
        return 1;
    }
    if (!ready) {
        goto finished;
    }
    puts("Work");
    finished:
    puts("End");
    return 0;
}
