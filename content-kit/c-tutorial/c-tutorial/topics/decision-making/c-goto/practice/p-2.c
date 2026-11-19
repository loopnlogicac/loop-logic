#include <stdio.h>

int main(void)
{
    int code;
    printf("Input: ");
    if (scanf("%d", &code) != 1 || code < 0 || code > 9) {
        return 1;
    }
    if (code != 3) {
        goto report;
    }
    puts("Valid");
    report:
    puts("Done");
    return 0;
}
